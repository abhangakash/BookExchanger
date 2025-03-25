import pandas as pd
import numpy as np
import os

# Simulate a larger dataset
np.random.seed(42)
n_samples = 1000

data = {
    'Condition': np.random.choice(['new', 'good', 'average', 'poor'], n_samples),
    'Publication_Year': np.random.randint(2000, 2024, n_samples),
    'Original_Price': np.random.randint(10, 5000, n_samples),
    'Pages': np.random.randint(50, 1000, n_samples)
}

df = pd.DataFrame(data)

# Map Condition to Numerical Values
condition_mapping = {'new': 5, 'good': 4, 'average': 3, 'poor': 2}
df['Condition'] = df['Condition'].map(condition_mapping)

# Calculate Book Age
df['Book_Age'] = 2024 - df['Publication_Year']

# Simulate Target Price
df['Target_Price'] = (
    df['Original_Price'] *
    (df['Condition'] / 5) *  # Condition affects price proportionally
    (1 - (df['Book_Age'] / 100))  # Older books lose value
)
df['Target_Price'] = df['Target_Price'].apply(lambda x: max(x, 0))  # Ensure no negative prices

# Save dataset in the current directory of this script
dataset_path = os.path.join(os.path.dirname(__file__), 'simulated_book_data.csv')
df.to_csv(dataset_path, index=False)
print(f"Dataset generated and saved as '{dataset_path}'")
