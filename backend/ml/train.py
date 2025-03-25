import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error
import joblib
import os
from xgboost import XGBRegressor

# Load Dataset
dataset_path = os.path.join(os.path.dirname(__file__), 'simulated_book_data.csv')
df = pd.read_csv(dataset_path)

# Features and Target
X = df[['Condition', 'Book_Age', 'Original_Price', 'Pages']]
y = df['Target_Price']

# Scale Features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the Model (XGBRegressor)
model = XGBRegressor(n_estimators=200, learning_rate=0.1, max_depth=6, random_state=42)
model.fit(X_train, y_train)

# Evaluate the Model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error: {mse}")

# Save the Model and Scaler
model_dir = os.path.join(os.path.dirname(__file__), 'price_prediction_model.pkl')
scaler_dir = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

joblib.dump(model, model_dir)
joblib.dump(scaler, scaler_dir)

print(f"Model saved as '{model_dir}'")
print(f"Scaler saved as '{scaler_dir}'")
