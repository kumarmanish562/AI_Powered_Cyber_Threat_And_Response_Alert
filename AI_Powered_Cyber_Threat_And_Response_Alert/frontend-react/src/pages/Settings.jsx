import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import { getProfile, api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from 'qrcode.react';
import gsap from "gsap";
import {
  User, Bell, Lock, Globe, Shield, Key, Save, Eye, EyeOff, Copy, Mail, Loader, Camera, RefreshCw, LogOut, ChevronRight, ShieldCheck
} from "lucide-react";

// ----- Helper Components -----

const Toggle = ({ label, checked, onChange, description, disabled }) => (
  <div className={`group flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-800 last:border-0 ${disabled ? 'opacity-50' : ''}`}>
    <div>
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">{label}</h4>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
      {disabled && !checked && (
        <p className="text-[10px] text-rose-400 mt-1 font-bold animate-pulse flex items-center gap-1">
          <Shield size={10} /> Configure 2FA above to unlock this setting.
        </p>
      )}
    </div>
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${checked ? "bg-cyan-600" : "bg-slate-300 dark:bg-slate-700"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${checked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  </div >
);

const InputGroup = ({ label, name, type = "text", value, onChange, icon, placeholder, canReveal, readOnly }) => {
  const [show, setShow] = useState(false);
  const inputType = canReveal ? (show ? "text" : "password") : type;
  const IconComponent = icon;

  return (
    <div className="mb-5 group">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {IconComponent ? <IconComponent size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-500 transition-colors" /> : null}
        </div>
        <input
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`block w-full bg-slate-100 dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all placeholder:text-slate-500 dark:placeholder:text-slate-600 ${readOnly ? 'opacity-70 cursor-not-allowed bg-slate-200/50 dark:bg-slate-900/50' : 'hover:border-slate-400 dark:hover:border-slate-600'}`}
        />
        {canReveal && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
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
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-field", {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
    <div ref={containerRef} className="space-y-8">
      <div className="anim-field flex items-center gap-8 pb-8 border-b border-slate-200 dark:border-slate-800/50">
        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-slate-100 dark:border-[#1e293b] overflow-hidden ring-4 ring-transparent group-hover:ring-cyan-500/30 transition-all duration-300">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <span>{user?.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}</span>
            )}
          </div>
          <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm">
            <Camera className="text-white w-8 h-8 drop-shadow-lg" />
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Photo</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Update your public avatar.</p>
          <div className="flex gap-3 pt-1">
            <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition shadow-lg shadow-cyan-900/20">
              Upload New
            </button>
            <button className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold uppercase tracking-wider rounded-lg transition border border-slate-300 dark:border-slate-700">
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="anim-field"><InputGroup label="Full Name" name="full_name" icon={User} value={formData.full_name} onChange={handleChange} /></div>
        <div className="anim-field"><InputGroup label="Email Address" name="email" icon={Mail} value={user?.email || ""} readOnly /></div>
        <div className="anim-field"><InputGroup label="Job Title" name="job_title" icon={Shield} value={formData.job_title} onChange={handleChange} /></div>
        <div className="anim-field"><InputGroup label="Timezone" icon={Globe} value="UTC-5 (Eastern Time)" readOnly /></div>
      </div>
    </div>
  );
};

const SecuritySettings = ({ user, onUserUpdate }) => {
  const [passwords, setPasswords] = useState({ current: "", new: "" });
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // MFA States
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [mfaSecret, setMfaSecret] = useState("");

  const isMfaUnlockable = user?.mfa_enabled || showMfaSetup;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-sec", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

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
    if (showMfaSetup) {
      setShowMfaSetup(false);
      return;
    }
    try {
      const res = await api.get("/auth/me/mfa/setup");
      setQrValue(res.data.qr_uri);
      setMfaSecret(res.data.secret);
      setShowMfaSetup(true);

      // Animate QR entrance
      setTimeout(() => {
        gsap.fromTo(".qr-container",
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }, 10);
    } catch (err) {
      alert("Failed to generate MFA setup.");
    }
  };

  const handleMfaToggle = (val) => {
    onUserUpdate({ mfa_enabled: val });
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="anim-sec">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Key size={18} className="text-cyan-600 dark:text-cyan-400" /> Password & Authentication</h3>
        <div className="p-6 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl">
          <InputGroup label="Current Password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} icon={Lock} placeholder="********" canReveal />
          <InputGroup label="New Password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} icon={Lock} placeholder="Minimum 8 characters" canReveal />
          <div className="flex justify-end">
            <button
              onClick={handlePasswordChange}
              disabled={loading}
              className="mt-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>

      <div className="anim-sec pt-6 border-t border-slate-200 dark:border-slate-800/50">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-600 dark:text-emerald-400" /> Two-Factor Authentication</h3>

        <div className="bg-slate-100 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 mb-4 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors"><Shield size={24} /></div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Authenticator App</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Use Google Authenticator or Authy</p>
              </div>
            </div>
            <button
              onClick={handleConfigureMfa}
              className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-lg border transition-all ${showMfaSetup ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600' : 'bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30 hover:bg-cyan-600/20'}`}
            >
              {showMfaSetup ? "Cancel Setup" : (user?.mfa_enabled ? "Re-Configure" : "Setup Now")}
            </button>
          </div>

          {showMfaSetup && (
            <div className="qr-container mt-6 p-6 bg-white rounded-xl flex flex-col items-center border border-slate-200 shadow-xl">
              <div className="p-2 bg-white rounded-lg shadow-inner">
                <QRCodeCanvas value={qrValue} size={160} />
              </div>
              <div className="mt-4 text-center">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold mb-1">Manual Entry Code</p>
                <p className="text-slate-900 text-sm font-mono bg-slate-100 px-3 py-1.5 rounded border border-slate-200 select-all">{mfaSecret}</p>
              </div>
              <p className="text-slate-400 text-xs mt-4 max-w-xs text-center">Scan this QR code with your authenticator app to generate your 6-digit security codes.</p>
            </div>
          )}
        </div>

        <div className="px-2">
          <Toggle
            label="Enforce 2FA for Login"
            checked={user?.mfa_enabled || false}
            onChange={handleMfaToggle}
            disabled={!isMfaUnlockable}
            description="Require a temporary code every time you sign in to your account."
          />
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = ({ user, onUserUpdate }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-notif", {
        x: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (key, val) => {
    onUserUpdate({ [key]: val });
  };

  return (
    <div ref={containerRef} className="space-y-1">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">Alert Preferences</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Manage how and when you receive system notifications.</p>
      </div>
      <div className="anim-notif">
        <Toggle
          label="Critical Threat Alerts (Email)"
          checked={user?.email_alerts !== false}
          onChange={(v) => handleChange("email_alerts", v)}
          description="Receive immediate emails when High/Critical threats are detected."
        />
      </div>
      <div className="anim-notif">
        <Toggle
          label="SMS Notifications"
          checked={user?.sms_alerts || false}
          onChange={(v) => handleChange("sms_alerts", v)}
          description="Receive text messages for server downtime events and critical failures."
        />
      </div>
      <div className="anim-notif">
        <Toggle
          label="Weekly Security Digest"
          checked={user?.weekly_reports !== false}
          onChange={(v) => handleChange("weekly_reports", v)}
          description="A summary of weekly attacks prevented and system health stats."
        />
      </div>
      <div className="anim-notif">
        <Toggle
          label="Marketing & Product Updates"
          checked={false}
          onChange={() => { }}
          description="Receive news about new features and product improvements."
        />
      </div>
    </div>
  );
};

const ApiSettings = ({ user }) => {
  const [apiKey, setApiKey] = useState(user?.api_key || "No Key Generated");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".anim-api", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.2)"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const generateKey = async () => {
    if (!window.confirm("Generating a new key will revoke the old one. This action cannot be undone. Continue?")) return;
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
    <div ref={containerRef} className="space-y-8">
      <div className="anim-api bg-amber-500/10 border border-amber-500/20 p-5 rounded-xl flex gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Lock size={64} /></div>
        <div className="p-2 bg-amber-500/20 rounded-lg h-fit text-amber-500"><Lock size={24} /></div>
        <div className="relative z-10">
          <h4 className="text-amber-400 text-sm font-bold uppercase tracking-wide">Secret Keys</h4>
          <p className="text-amber-200/70 text-sm mt-1 leading-relaxed">These keys grant full read/write access to your account. Treat them like your password and never share them in client-side code.</p>
        </div>
      </div>

      <div className="anim-api">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Production API Key</label>
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Key size={16} className="text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-500 transition-colors" /></div>
            <input type="text" readOnly value={apiKey} className="block w-full bg-slate-100 dark:bg-[#0b1120] border border-slate-300 dark:border-slate-700 rounded-xl py-3 pl-10 pr-12 text-sm font-mono text-slate-600 dark:text-slate-400 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all" />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">READ/WRITE</span>
            </div>
          </div>
          <button onClick={copyToClipboard} className="px-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-all hover:text-slate-900 dark:hover:text-white hover:shadow-lg active:scale-95" title="Copy Key">
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="anim-api pt-4 border-t border-slate-800/50">
        <button onClick={generateKey} disabled={loading} className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-bold flex items-center gap-2 transition-colors disabled:opacity-50">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> {loading ? "Generating New Token..." : "Roll API Key"}
        </button>
        <p className="text-xs text-slate-500 dark:text-slate-600 mt-2">Rolling the key will immediately invalidate the previous one.</p>
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

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Simulate API delay for smooth entry
        // await new Promise(r => setTimeout(r, 500));
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

        // Entry Animation
        gsap.from(sidebarRef.current, { x: -50, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.1 });
        gsap.from(contentRef.current, { y: 30, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.2 });

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
      // Success Animation
      const btn = document.getElementById('save-btn');
      gsap.to(btn, { scale: 1.05, duration: 0.1, yoyo: true, repeat: 1 });
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

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-t-cyan-500 rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-600 dark:text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden transition-colors duration-300">
      <Sidebar />

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 dark:bg-blue-900/5 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
      </div>

      <main className="flex-1 p-8 lg:p-12 overflow-y-auto h-screen relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl text-slate-900 dark:text-white font-bold tracking-tight mb-2">System Settings</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your personal profile, security preferences, and API access.</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-500 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-3 py-1 rounded-full">v2.4.0-stable</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Settings Sidebar */}
            <div ref={sidebarRef} className="w-full lg:w-64 flex-shrink-0">
              <nav className="flex flex-col gap-2 sticky top-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center justify-between px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}`}
                    >
                      <div className="flex items-center gap-3 relative z-10">
                        <Icon size={18} className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors"} />
                        {tab.label}
                      </div>
                      {isActive && <ChevronRight size={16} className="relative z-10 opacity-50" />}
                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-100"></div>}
                    </button>
                  );
                })}

                <div className="my-4 border-t border-slate-200 dark:border-slate-800/50 mx-4"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-300 transition-all group"
                >
                  <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
                </button>
              </nav>
            </div>

            {/* Settings Content Area */}
            <div ref={contentRef} className="flex-1 min-w-0">
              <div className="bg-white/80 dark:bg-[#1e293b]/40 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden transition-colors duration-300">
                {/* Top Loading Bar */}
                {isSaving && <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse z-20"></div>}

                <div className="p-8 lg:p-10 min-h-[500px]">
                  {activeTab === "general" && <GeneralSettings user={{ ...user, ...stagedData }} onUserUpdate={handleStageUpdate} />}
                  {activeTab === "notifications" && <NotificationSettings user={{ ...user, ...stagedData }} onUserUpdate={handleStageUpdate} />}
                  {activeTab === "security" && <SecuritySettings user={{ ...user, ...stagedData }} onUserUpdate={handleStageUpdate} />}
                  {activeTab === "api" && <ApiSettings user={user} />}
                </div>

                {/* Footer Action Bar */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1e293b]/80 backdrop-blur flex justify-between items-center transition-colors duration-300">
                  <p className="text-xs text-slate-500 hidden sm:block">Last saved: {new Date().toLocaleTimeString()}</p>
                  <div className="flex gap-4 ml-auto">
                    <button className="px-6 py-2.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                    <button
                      id="save-btn"
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-cyan-900/20 hover:shadow-cyan-900/40 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
                    >
                      {isSaving ? <><Loader className="w-4 h-4 animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}