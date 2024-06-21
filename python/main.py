import pandas as pd
from popularity_based import *
from content_based import *
from collaborative_filtering import *
from hybrid_model import *
import hashlib
from flask import Flask, jsonify, request
import csv
from pymongo import MongoClient
from flask_cors import CORS
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error


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
    results['predicted_trend'] = np.where(results['predicted_trend'] > 0, 'Increase', 'Decrease')
    
    return results[['timestamp', 'currentPrice', 'predicted_price', 'predicted_trend']]

def pseudonymize_email(email):
    # Using hashlib to generate a hash of the email address
    hashed_email = hashlib.md5(email.encode('utf-8')).hexdigest()
        
    # Take the first 8 characters of the hash as a pseudonymous value
    pseudonymous_value = hashed_email[:8]
        
    return pseudonymous_value


app = Flask(__name__)
CORS(app,resources={r"/": {"origins": ""}},supports_credentials=True)

@app.route('/api/data', methods=['GET'])
def get_data():


    # Get the 'param' query parameter from the request
    param = request.args.get('param', '')
    
    # Read the pre-processed data
    df = pd.read_csv("output.csv") #,encoding='latin1')
    # print(df.columns)
    # Convert the 'timestamp' column to datetime

    df['timestamp'] = pd.to_datetime(df['timestamp'])




    # Filter the data to include only interactions after the year 2015
    df = df[df['timestamp'].dt.year > 2015]
    df.head()

    df.shape


    # Provide the user_id for which you want to get recommendations 
    # user_id_to_recommend = '766ee2a6'
    user_id_to_recommend = param
    # Get the user's interactions (Item_id, title, category, and brand)
    user_interactions = df[df['user_id'] == user_id_to_recommend][['item_id', 'title', 'sub_cat', 'brand']]\
        .drop_duplicates('item_id')
    # print(f"User {user_id_to_recommend} Interacted for the following products:")
    # print(user_interactions)

    dataList = []
    try:

        # Create an instance of the HybridRecommender class
        hybrid_recommender = HybridRecommender(df, content_based_weight=0.6, collaborative_filtering_weight=0.4)
        top_n_recommendations_hybrid = hybrid_recommender.get_recommendations(user_id_to_recommend)

        # Get the model's recommended products
        recommendations = df[df['item_id'].isin(top_n_recommendations_hybrid)][
            ['item_id', 'title', 'sub_cat', 'brand']].drop_duplicates('item_id')
        # print(f"Model recommends the following products to the user {user_id_to_recommend}:")
        # print(recommendations)

        
        for i in recommendations['item_id']:
            dataList.append(i)
    except:
        print("User has not interacted")



    dataList.append("end")





    # Instantiate the PersonalizedRecommender class
    popularity_recommender = PopularityBasedRecommender(df)

    # Get trending items in the last 15 days (e.g., top 10)
    trending_items = popularity_recommender.get_trending_items(period=180, top_n=8)

    # Print the recommendations
    # print("Trending Items:")
    # print(trending_items)
    for i in trending_items['item_id']:
        dataList.append(i)

    
    # print(dataList)
    return jsonify(dataList)

@app.route('/api/update', methods=['GET'])
def update_data():
     # Connect to MongoDB
    try:
        # Connect to MongoDB using MongoClient
        client = MongoClient('mongodb+srv://kevinfrancisfernandes8:Kevin123@cluster0.e8uh7q9.mongodb.net/?retryWrites=true&w=majority')
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")


    db = client['test']
    collection = db['products']

    # Define CSV file path
    csv_file_path = 'output.csv'


    # Define CSV header
    csv_header = ['item_id','title', 'brand','user_id', 'rating', 'timestamp', 'sub_cat','main_cat','age','gender','location','highestPrice','lowestPrice','currentPrice','originalPrice']

    # Open CSV file for writing
    with open(csv_file_path, 'w', newline='',encoding='utf-8') as csv_file:
        # Create CSV writer
        csv_writer = csv.writer(csv_file)
        
        # Write header to CSV
        csv_writer.writerow(csv_header)

        # Iterate through MongoDB documents
        for document in collection.find():
            # Iterate through all users in the 'users' field
            highestPrice = document['highestPrice']
                
            lowestPrice = document['lowestPrice']
            currentPrice = document['currentPrice']
            originalPrice = document['originalPrice']
            for user in document['usersInteraction']:
                # Extract fields from the document
                user_id = pseudonymize_email(user['email'])
            # url = document['url']
                item_id = str(document['_id'])
                title = document['title'].replace(',','').replace('\"','').replace('|','').lower()
                main_cat = document['main_cat']
                sub_cat = document['sub_cat']
                timestamp = document['updatedAt'].strftime('%Y-%m-%d %H:%M:%S') or document['createdAt'].strftime('%Y-%m-%d %H:%M:%S')
                rating = document.get('rating', 'N/A')
                brand=title.split()[0]
                age=user['age']
                gender= user['gender']
                location=user['location']
                
                # Write data to CSV
                csv_writer.writerow([ item_id, title, brand, user_id,rating, timestamp,sub_cat,main_cat, age,gender,location,highestPrice,lowestPrice,currentPrice,originalPrice])

    # Close MongoDB connection
    client.close()

    df = pd.read_csv('output.csv', encoding='latin1')

    # Keep only unique rows
    unique_df = df.drop_duplicates()

    # Write the DataFrame with unique rows to a new CSV file
    unique_df.to_csv('output.csv', index=False)
    print(f"CSV file '{csv_file_path}' generated successfully.")
    return jsonify("hi")

@app.route('/api/predict', methods=['GET'])
def predict_data():
    try:
        item_id = request.args.get('param', '')
        
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

        predictions = get_item_price_predictions(item_id, model, data)
        predictions = predictions.to_dict(orient='records')
        print(predictions)
        return jsonify(predictions[0]['predicted_trend'])
    except Exception as e:
        return jsonify([])
        
    
    




    


if __name__ == '__main__':
    app.run(debug=True)