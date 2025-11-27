import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { getProfile, api } from "../services/api"; 
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import {
  User, Bell, Lock, Globe, Shield, Key, Save, Eye, EyeOff, Copy, Mail, Loader, Camera, RefreshCw, LogOut
} from "lucide-react";

// ----- Helper Components -----

const Toggle = ({ label, checked, onChange, description, disabled }) => (
  <div className={`flex items-center justify-between py-4 border-b border-slate-800 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
    <div>
      <h4 className="text-sm font-medium text-slate-200">{label}</h4>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      {disabled && !checked && (
          <p className="text-[10px] text-rose-400 mt-1 font-bold animate-pulse">
              ⚠ Configure 2FA above to unlock this setting.
          </p>
      )}
    </div>
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        checked ? "bg-cyan-600" : "bg-slate-700"
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const InputGroup = ({ label, name, type = "text", value, onChange, icon, placeholder, canReveal, readOnly }) => {
  const [show, setShow] = useState(false);
  const inputType = canReveal ? (show ? "text" : "password") : type;
  const IconComponent = icon;

  return (
    <div className="mb-5">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {IconComponent ? <IconComponent size={16} className="text-slate-500" /> : null}
        </div>
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`block w-full bg-[#0b1120] border border-slate-700 rounded-lg py-2.5 pl-10 pr-10 text-sm text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
        {canReveal && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

// ----- Sections Content -----

const GeneralSettings = ({ user, onUserUpdate }) => {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || "",
    job_title: user?.job_title || ""
  });
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const newData = { ...formData, [e.target.name]: e.target.value };
    setFormData(newData);
    onUserUpdate(newData);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      onUserUpdate({ ...formData, avatarFile: file });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 pb-6 border-b border-slate-800">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-3xl font-bold text-white shadow-xl border-4 border-[#1e293b] overflow-hidden">
                {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <span>{user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}</span>
                )}
            </div>
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" />
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div>
          <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition shadow-md">
            Change Avatar
          </button>
          <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputGroup label="Full Name" name="full_name" icon={User} value={formData.full_name} onChange={handleChange} />
        <InputGroup label="Email Address" name="email" icon={Mail} value={user?.email || ""} readOnly />
        <InputGroup label="Job Title" name="job_title" icon={Shield} value={formData.job_title} onChange={handleChange} />
        <InputGroup label="Timezone" icon={Globe} value="UTC-5 (Eastern Time)" readOnly />
      </div>
    </div>
  );
};

const SecuritySettings = ({ user, onUserUpdate }) => {
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [loading, setLoading] = useState(false);
  
  // MFA States
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");
  
  const isMfaUnlockable = user?.mfa_enabled || showMfaSetup;

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.new) return alert("Please fill both password fields.");
    setLoading(true);
    try {
        await api.post("/auth/me/change-password", { current_password: passwords.current, new_password: passwords.new });
        alert("Password changed successfully! Email notification sent.");
        setPasswords({ current: "", new: "" });
    } catch (err) {
        alert(err.response?.data?.detail || "Failed to change password.");
    } finally {
        setLoading(false);
    }
  };

  const handleConfigureMfa = async () => {
    try {
      const res = await api.get("/auth/me/mfa/setup");
      setQrValue(res.data.qr_uri);
      setMfaSecret(res.data.secret);
      setShowMfaSetup(true);
    } catch (err) {
      alert("Failed to generate MFA setup.");
    }
  };

  const handleMfaToggle = (val) => {
      onUserUpdate({ mfa_enabled: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Password & Authentication</h3>
        <InputGroup label="Current Password" value={passwords.current} onChange={(e) => setPasswords({...passwords, current: e.target.value})} icon={Lock} placeholder="********" canReveal />
        <InputGroup label="New Password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} icon={Lock} placeholder="Minimum 8 characters" canReveal />
        <button 
            onClick={handlePasswordChange}
            disabled={loading}
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg"
        >
            {loading ? "Updating..." : "Update Password"}
        </button>
      </div>

      <div className="pt-6 border-t border-slate-800">
        <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
        
        <div className="bg-[#0b1120] p-4 rounded-lg border border-slate-700 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400"><Shield size={24} /></div>
              <div>
                <p className="text-sm font-medium text-white">Authenticator App</p>
                <p className="text-xs text-slate-400">Use Google Authenticator or Authy</p>
              </div>
            </div>
            <button 
                onClick={handleConfigureMfa}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-600"
            >
                {user?.mfa_enabled ? "Re-Configure" : "Configure"}
            </button>
          </div>
          
          {showMfaSetup && (
            <div className="mt-4 p-4 bg-white rounded-lg flex flex-col items-center animate-fade-in">
               <QRCodeCanvas value={qrValue} size={150} />
               <p className="text-slate-900 text-xs mt-2 font-mono">Secret: {mfaSecret}</p>
               <p className="text-slate-500 text-[10px] mt-1">Scan this with your app to generate codes.</p>
            </div>
          )}
        </div>

        <Toggle 
          label="Enforce 2FA for Login" 
          checked={user?.mfa_enabled || false} 
          onChange={handleMfaToggle} 
          disabled={!isMfaUnlockable} 
          description="Require a code every time you sign in." 
        />
      </div>
    </div>
  );
};

const NotificationSettings = ({ user, onUserUpdate }) => {
  const handleChange = (key, val) => {
      onUserUpdate({ [key]: val });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-white mb-4">Alert Preferences</h3>
      <Toggle 
        label="Critical Threat Alerts (Email)" 
        checked={user?.email_alerts !== false} 
        onChange={(v) => handleChange("email_alerts", v)} 
        description="Receive immediate emails when High/Critical threats are detected." 
      />
      <Toggle 
        label="SMS Notifications" 
        checked={user?.sms_alerts || false} 
        onChange={(v) => handleChange("sms_alerts", v)} 
        description="Receive text messages for server downtime events." 
      />
      <Toggle 
        label="Weekly Security Digest" 
        checked={user?.weekly_reports !== false} 
        onChange={(v) => handleChange("weekly_reports", v)} 
        description="A summary of weekly attacks prevented and system health." 
      />
    </div>
  );
};

const ApiSettings = ({ user }) => {
  const [apiKey, setApiKey] = useState(user?.api_key || "No Key Generated");
  const [loading, setLoading] = useState(false);

  const generateKey = async () => {
      if(!window.confirm("Generating a new key will revoke the old one. Continue?")) return;
      setLoading(true);
      try {
          const res = await api.post("/auth/me/api-key");
          setApiKey(res.data.api_key);
      } catch (err) {
          alert("Failed to generate key.");
      } finally {
          setLoading(false);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(apiKey);
      alert("Copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex gap-3">
        <div className="text-amber-500 mt-1"><Lock size={18} /></div>
        <div>
          <h4 className="text-amber-400 text-sm font-bold">Secret Keys</h4>
          <p className="text-amber-200/70 text-xs mt-1">These keys grant full access to your account. Never share them.</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Production API Key</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Key size={16} className="text-slate-500" /></div>
            <input type="text" readOnly value={apiKey} className="block w-full bg-[#0b1120] border border-slate-700 rounded-lg py-2.5 pl-10 pr-10 text-sm font-mono text-slate-400" />
          </div>
          <button onClick={copyToClipboard} className="px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors" title="Copy Key"><Copy size={18} /></button>
        </div>
      </div>
      <div className="pt-4">
        <button onClick={generateKey} disabled={loading} className="text-sm text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> {loading ? "Generating..." : "Generate New Token"}
        </button>
      </div>
    </div>
  );
};

// ----- Main Component -----

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [stagedData, setStagedData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const data = await getProfile();
            setUser(data);
            setStagedData({
                email_alerts: data.email_alerts,
                sms_alerts: data.sms_alerts,
                weekly_reports: data.weekly_reports,
                mfa_enabled: data.mfa_enabled,
                full_name: data.full_name,
                job_title: data.job_title
            });
            setLoading(false);
        } catch (error) {
            if (error.response?.status === 401) navigate("/login");
            setLoading(false);
        }
    };
    fetchUser();
  }, [navigate]);

  const handleStageUpdate = (newData) => {
      setStagedData(prev => ({ ...prev, ...newData }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
        const formData = new FormData();
        Object.keys(stagedData).forEach(key => {
            if (key !== 'avatarFile') formData.append(key, stagedData[key]);
        });
        if (stagedData.avatarFile) formData.append("avatar", stagedData.avatarFile);

        const res = await api.put("/auth/me", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        
        setUser(res.data);
        alert("Settings saved successfully!");
    } catch (err) {
        console.error(err);
        alert("Failed to save settings.");
    } finally {
        setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        navigate("/");
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API Keys", icon: Key },
  ];

  if (loading) return <div className="flex min-h-screen bg-[#0f172a] items-center justify-center"><Loader className="animate-spin text-cyan-500" /></div>;

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="mb-8">
          <h1 className="text-2xl text-white font-bold">System Settings</h1>
          <p className="text-slate-400">Manage your account settings and preferences.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 flex-shrink-0">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${isActive ? "bg-cyan-600/10 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                    <Icon size={18} /> {tab.label}
                  </button>
                );
              })}
              
              {/* Divider */}
              <div className="my-2 border-t border-slate-800/50"></div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all"
              >
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>

          <div className="flex-1 max-w-3xl">
            <div className="bg-[#1e293b] rounded-xl border border-slate-800 shadow-lg p-8 min-h-[500px] relative">
              <div className="mb-20">
                {activeTab === "general" && <GeneralSettings user={{...user, ...stagedData}} onUserUpdate={handleStageUpdate} />}
                {activeTab === "notifications" && <NotificationSettings user={{...user, ...stagedData}} onUserUpdate={handleStageUpdate} />}
                {activeTab === "security" && <SecuritySettings user={{...user, ...stagedData}} onUserUpdate={handleStageUpdate} />}
                {activeTab === "api" && <ApiSettings user={user} />}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800 bg-[#1e293b]/95 backdrop-blur rounded-b-xl flex justify-end gap-3">
                <button className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-70 disabled:cursor-not-allowed">
                  {isSaving ? <><Loader className="w-4 h-4 animate-spin"/> Saving...</> : <><Save size={16} /> Save Changes</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}