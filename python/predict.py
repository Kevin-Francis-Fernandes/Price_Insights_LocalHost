# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from sklearn.linear_model import LinearRegression
# from sklearn.metrics import mean_squared_error, mean_absolute_error

# # Step 1: Load the CSV data
# file_path = 'output.csv'
# data = pd.read_csv(file_path)

# # Step 2: Inspect the data to understand the column names
# print("Columns in the dataset:", data.columns)

# # Step 3: Preprocess the data
# # Convert timestamp to datetime format if applicable
# # Step 3: Preprocess the data
# # Convert timestamp to datetime format if applicable
# # Step 3: Preprocess the data
# # Convert timestamp to datetime format if applicable
# if 'timestamp' in data.columns:
#     data['timestamp'] = pd.to_datetime(data['timestamp'])

# # Handle missing values if any
# data.ffill(inplace=True)  # Forward fill missing values

# # Step 4: Feature Engineering
# data['price_diff'] = data['highestPrice'] - data['lowestPrice']
# data['price_change'] = data['currentPrice'] - data['originalPrice']

# # Calculate price changes over time to determine trends
# data = data.sort_values(by=['item_id', 'timestamp'])
# data['price_trend'] = data.groupby('item_id')['currentPrice'].diff().fillna(0)
# data['price_trend'] = np.where(data['price_trend'] > 0, 1, -1)  # 1 for increase, -1 for decrease

# # Step 5: Split the data
# X = data[['highestPrice', 'lowestPrice', 'price_diff', 'price_change']]
# y = data['currentPrice']
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Handle missing values in training and testing data
# X_train.fillna(X_train.mean(), inplace=True)
# X_test.fillna(X_test.mean(), inplace=True)

# # Step 6: Model Selection
# model = LinearRegression()
# model.fit(X_train, y_train)

# # Step 7: Evaluate the Model
# y_pred = model.predict(X_test)
# rmse = np.sqrt(mean_squared_error(y_test, y_pred))
# mae = mean_absolute_error(y_test, y_pred)
# print(f'RMSE: {rmse}')
# print(f'MAE: {mae}')

# # Function to get price predictions and trends for a specific item_id
# def get_item_price_predictions(item_id, model, data):
#     # Filter data for the given item_id
#     item_data = data[data['item_id'] == item_id]
#     if item_data.empty:
#         return f"No data found for item_id: {item_id}"
    
#     # Prepare features for prediction
#     X_item = item_data[['highestPrice', 'lowestPrice', 'price_diff', 'price_change']]
#     # Handle missing values in item data
#     X_item.fillna(X_item.mean(), inplace=True)
#     predictions = model.predict(X_item)
    
#     # Create a DataFrame for the results
#     results = item_data.copy()
#     results['predicted_price'] = predictions
    
#     # Calculate trend predictions
#     results['predicted_trend'] = results['predicted_price'].diff().fillna(0)
#     results['predicted_trend'] = np.where(results['predicted_trend'] > 0, 'Increasing', 'Decreasing')
    
#     return results[['timestamp', 'currentPrice', 'predicted_price', 'predicted_trend']]



import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error

# Step 1: Load the CSV data
file_path = 'output.csv'
data = pd.read_csv(file_path)

# Step 2: Inspect the data to understand the column names
print("Columns in the dataset:", data.columns)

# Step 3: Preprocess the data
# Convert timestamp to datetime format if applicable
if 'timestamp' in data.columns:
    data['timestamp'] = pd.to_datetime(data['timestamp'])

# Handle missing values if any
data.ffill(inplace=True)  # Forward fill missing values

# Step 4: Feature Engineering
data['price_diff'] = data['highestPrice'] - data['lowestPrice']
data['price_change'] = data['currentPrice'] - data['originalPrice']

# Calculate price changes over time to determine trends
data = data.sort_values(by=['item_id', 'timestamp'])
data['price_trend'] = data.groupby('item_id')['currentPrice'].diff().fillna(0)
data['price_trend'] = np.where(data['price_trend'] > 0, 1, -1)  # 1 for increase, -1 for decrease

# Step 5: Split the data
X = data[['highestPrice', 'lowestPrice', 'price_diff', 'price_change']]
y = data['currentPrice']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Handle missing values in training and testing data
X_train = X_train.fillna(X_train.mean())
X_test = X_test.fillna(X_test.mean())

# Step 6: Model Selection
model = LinearRegression()
model.fit(X_train, y_train)

# Step 7: Evaluate the Model
y_pred = model.predict(X_test)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
mae = mean_absolute_error(y_test, y_pred)
print(f'RMSE: {rmse}')
print(f'MAE: {mae}')

# Function to get price predictions and trends for a specific item_id
def get_item_price_predictions(item_id, model, data):
    # Filter data for the given item_id
    item_data = data[data['item_id'] == item_id]
    if item_data.empty:
        return f"No data found for item_id: {item_id}"
    
    # Prepare features for prediction
    X_item = item_data[['highestPrice', 'lowestPrice', 'price_diff', 'price_change']].copy()
    # Handle missing values in item data
    X_item = X_item.fillna(X_item.mean())
    predictions = model.predict(X_item)
    
    # Create a DataFrame for the results
    results = item_data.copy()
    results['predicted_price'] = predictions
    
    # Calculate trend predictions
    results['predicted_trend'] = results['predicted_price'].diff().fillna(0)
    results['predicted_trend'] = np.where(results['predicted_trend'] > 0, 'Increasing', 'Decreasing')
    
    return results[['timestamp', 'currentPrice', 'predicted_price', 'predicted_trend']]


# Example usage
item_id = "662d1884fcfae462736373a0"  # Replace with the desired item_id
predictions = get_item_price_predictions(item_id, model, data)
print(predictions)
