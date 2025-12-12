import joblib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, roc_curve, auc
import numpy as np

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models")
PLOTS_DIR = os.path.join(BASE_DIR, "plots")

# Create plots directory if it doesn't exist
if not os.path.exists(PLOTS_DIR):
    os.makedirs(PLOTS_DIR)

def generate_plots():
    print("Loading test data (this might take a minute)...")
    try:
        X_test, y_test = joblib.load(os.path.join(MODEL_PATH, "test_data.joblib"))
        print("Data loaded.")
    except FileNotFoundError:
        print("Error: test_data.joblib not found in models directory.")
        return

    print("Loading model...")
    try:
        model = joblib.load(os.path.join(MODEL_PATH, "rf_model.joblib"))
        print("Model loaded.")
    except FileNotFoundError:
        print("Error: rf_model.joblib not found in models directory.")
        return

    print("Running predictions...")
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    # --- 1. Confusion Matrix ---
    print("Generating Confusion Matrix...")
    plt.figure(figsize=(8, 6))
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', cbar=False)
    plt.title('Confusion Matrix - Random Forest')
    plt.xlabel('Predicted Label')
    plt.ylabel('True Label')
    plt.savefig(os.path.join(PLOTS_DIR, "confusion_matrix.png"))
    plt.close()
    print(f"Saved {os.path.join(PLOTS_DIR, 'confusion_matrix.png')}")

    # --- 2. ROC Curve ---
    print("Generating ROC Curve...")
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('Receiver Operating Characteristic (ROC)')
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.savefig(os.path.join(PLOTS_DIR, "roc_curve.png"))
    plt.close()
    print(f"Saved {os.path.join(PLOTS_DIR, 'roc_curve.png')}")

    # --- 3. Learning Curve (Accuracy Graph) ---
    print("Generating Learning Curve (this will take a moment)...")
    from sklearn.model_selection import learning_curve
    
    # Use a subset for speed (first 50k samples)
    try:
        X_train, y_train = joblib.load(os.path.join(MODEL_PATH, "train_data.joblib"))
        subset_size = 50000
        if len(X_train) > subset_size:
            X_subset = X_train[:subset_size]
            y_subset = y_train[:subset_size]
        else:
            X_subset = X_train
            y_subset = y_train
            
        train_sizes, train_scores, test_scores = learning_curve(
            model, X_subset, y_subset, cv=3, n_jobs=-1, 
            train_sizes=np.linspace(0.1, 1.0, 5), scoring='accuracy'
        )

        train_scores_mean = np.mean(train_scores, axis=1)
        train_scores_std = np.std(train_scores, axis=1)
        test_scores_mean = np.mean(test_scores, axis=1)
        test_scores_std = np.std(test_scores, axis=1)

        plt.figure(figsize=(8, 6))
        plt.fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1, color="r")
        plt.fill_between(train_sizes, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1, color="g")
        plt.plot(train_sizes, train_scores_mean, 'o-', color="r", label="Training score")
        plt.plot(train_sizes, test_scores_mean, 'o-', color="g", label="Cross-validation score")

        plt.xlabel("Training examples")
        plt.ylabel("Accuracy Score")
        plt.title("Learning Curve (Accuracy)")
        plt.legend(loc="best")
        plt.grid(True)
        plt.savefig(os.path.join(PLOTS_DIR, "learning_curve.png"))
        plt.close()
        print(f"Saved {os.path.join(PLOTS_DIR, 'learning_curve.png')}")
    except Exception as e:
        print(f"Could not generate learning curve: {e}")

    print("\nAll plots generated successfully!")

if __name__ == "__main__":
    generate_plots()
