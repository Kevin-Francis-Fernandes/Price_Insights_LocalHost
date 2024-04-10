import pandas as pd
from popularity_based import *
from content_based import *
from collaborative_filtering import *
from hybrid_model import *

from flask import Flask, jsonify, request

app = Flask(__name__)

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




    # Create an instance of the HybridRecommender class
    hybrid_recommender = HybridRecommender(df, content_based_weight=0.6, collaborative_filtering_weight=0.4)
    top_n_recommendations_hybrid = hybrid_recommender.get_recommendations(user_id_to_recommend)

    # Get the model's recommended products
    recommendations = df[df['item_id'].isin(top_n_recommendations_hybrid)][
        ['item_id', 'title', 'sub_cat', 'brand']].drop_duplicates('item_id')
    # print(f"Model recommends the following products to the user {user_id_to_recommend}:")
    # print(recommendations)

    dataList = []
    for i in recommendations['item_id']:
        dataList.append(i)

    dataList.append("end")





    # Instantiate the PersonalizedRecommender class
    popularity_recommender = PopularityBasedRecommender(df)

    # Get trending items in the last 15 days (e.g., top 10)
    trending_items = popularity_recommender.get_trending_items(period=180, top_n=3)

    # Print the recommendations
    # print("Trending Items:")
    # print(trending_items)
    for i in trending_items['item_id']:
        dataList.append(i)

    

    return jsonify(dataList)

if __name__ == '__main__':
    app.run(debug=True)