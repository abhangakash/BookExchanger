from flask import Flask, request, jsonify
import joblib
import os
import pandas as pd

app = Flask(__name__)

# Load the trained model and scaler
model_path = os.path.join(os.path.dirname(__file__), 'price_prediction_model.pkl')
scaler_path = os.path.join(os.path.dirname(__file__), 'scaler.pkl')

model = joblib.load(model_path)
scaler = joblib.load(scaler_path)

@app.route('/predict-price', methods=['POST'])
def predict_price():
    try:
        # Extract input data
        data = request.json
        features = {
            'Condition': data['condition'],
            'Book_Age': 2024 - data['publication_year'],
            'Original_Price': data['original_price'],
            'Pages': data['pages']
        }

        # Convert Condition to Numeric
        condition_mapping = {'new': 5, 'good': 4, 'average': 3, 'poor': 2}
        features['Condition'] = condition_mapping[features['Condition']]

        # Create a DataFrame
        df = pd.DataFrame([features])

        # Scale Features
        X_scaled = scaler.transform(df)

        # Predict price
        predicted_price = float(model.predict(X_scaled)[0])

        # Logical constraints
        if features['Condition'] == 5:  # New condition
            predicted_price = min(predicted_price, features['Original_Price'])
        elif features['Condition'] == 2:  # Poor condition
            predicted_price = max(predicted_price, features['Original_Price'] * 0.2)

        return jsonify({'predicted_price': round(predicted_price, 2)})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = 5001  # Port for Flask app (different from Node.js)
    app.run(host='0.0.0.0', port=port, debug=True)
