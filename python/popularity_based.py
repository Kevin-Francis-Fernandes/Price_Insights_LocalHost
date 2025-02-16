import pandas as pd

class PopularityBasedRecommender:
    def __init__(self, df):
        self.df = df
        self.user_item_matrix = self._get_user_item_interaction_matrix()

    def _get_user_item_interaction_matrix(self):
        # Create user-item interaction matrix
        user_item_matrix = self.df.pivot_table(index='user_id', columns='item_id', values='rating').fillna(0)
        return user_item_matrix

    def get_trending_items(self, period=15, top_n=5):
        # Ensure 'timestamp' column is in datetime format
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])

        # Filter the dataset to get interactions in the last "period" days
        max_timestamp = self.df['timestamp'].max()
        recent_interactions = self.df[self.df['timestamp'] >= max_timestamp - pd.Timedelta(days=period)]

        # Calculate popularity based on recent interactions
        item_popularity = recent_interactions['item_id'].value_counts()

        # Get the top N trending items
        trending_items = item_popularity.head(top_n).index.tolist()

        # Retrieve the titles for the trending items (ensuring each item_id has a unique title)
        titles_df = self.df[self.df['item_id'].isin(trending_items)][['item_id', 'title']].drop_duplicates(subset=['item_id'])
        trending_titles = titles_df.set_index('item_id').loc[trending_items]['title'].values

        # Calculate interaction count and average rating for the trending items
        trending_interaction_count = item_popularity.head(top_n).values
        trending_avg_rating = recent_interactions.groupby('item_id')['rating'].mean().loc[trending_items].values

        # Return the top N trending items along with their titles, interaction count, and average rating
        return pd.DataFrame({
            'item_id': trending_items,
            'title': trending_titles,
            'interaction_count': trending_interaction_count,
            'avg_rating': trending_avg_rating
        })        # Return the top N trending items along with their titles, interaction count, and average rating
        
    def get_most_popular_items(self, top_n=5):
        # Calculate popularity based on overall interactions
        item_popularity = self.df['item_id'].value_counts()

        # Get the interaction count and average rating of the most popular items
        most_popular_items = item_popularity.head(top_n).index.tolist()
        get_title_by_item_id = lambda item_id: self.df[self.df['item_id'] == item_id]['title'].values[0]
        most_popular_titles = list(map(get_title_by_item_id, most_popular_items))
        most_popular_interaction_count = item_popularity.head(top_n).values
        most_popular_avg_rating = self.df[self.df['item_id'].isin(most_popular_items)].groupby('item_id')[
            'rating'].mean().values

        # Return the top N most popular items along with their interaction count and average rating
        return pd.DataFrame({'item_id': most_popular_items, 'title': most_popular_titles,
                             'interaction_count': most_popular_interaction_count,
                             'avg_rating': most_popular_avg_rating})

    def get_top_rated_items(self, min_interactions=10, top_n=5):
        # Calculate average ratings for items with minimum interactions
        item_ratings = self.df.groupby('item_id')['rating'].agg(['count', 'mean'])
        item_ratings = item_ratings[item_ratings['count'] >= min_interactions]

        # Get the interaction count and average rating of the top rated items
        top_rated_items = item_ratings.nlargest(top_n, 'mean').index.tolist()
        top_rated_titles = self.df[self.df['item_id'].isin(top_rated_items)]['title'].unique()
        top_rated_interaction_count = item_ratings.nlargest(top_n, 'mean')['count'].values
        top_rated_avg_rating = item_ratings.nlargest(top_n, 'mean')['mean'].values

        # Return the top N highest rated items along with their interaction count and average rating
        return pd.DataFrame({'item_id': top_rated_items, 'title': top_rated_titles,
                             'interaction_count': top_rated_interaction_count, 'avg_rating': top_rated_avg_rating})

    def get_bestsellers_in_demographic(self, age, gender, location, top_n=5):
        # Filter the dataset to get interactions in the user's demographic
        demographic_interactions = self.df[(self.df['age'] == age) &
                                           (self.df['gender'] == gender) &
                                           (self.df['location'] == location)]

        # Calculate popularity based on interactions in the user's demographic
        item_popularity = demographic_interactions['item_id'].value_counts()

        # Get the interaction count and average rating of the bestsellers in the demographic
        bestsellers_items = item_popularity.head(top_n).index.tolist()
        bestsellers_titles = self.df[self.df['item_id'].isin(bestsellers_items)]['title'].unique()
        bestsellers_interaction_count = item_popularity.head(top_n).values
        bestsellers_avg_rating = demographic_interactions.groupby('item_id')['rating'].mean().loc[
            bestsellers_items].values

        # Return the top N bestsellers in the demographic along with their interaction count and average rating
        return pd.DataFrame({'item_id': bestsellers_items, 'title': bestsellers_titles,
                             'interaction_count': bestsellers_interaction_count, 'avg_rating': bestsellers_avg_rating})

    def get_popular_in_location(self, location, top_n=5):
        # Filter the dataset to get interactions in the user's location
        location_interactions = self.df[self.df['location'] == location]

        # Calculate popularity based on interactions in the user's location
        item_popularity = location_interactions['item_id'].value_counts()

        # Get the interaction count and average rating of the popular items in the location
        popular_items = item_popularity.head(top_n).index.tolist()
        popular_titles = self.df[self.df['item_id'].isin(popular_items)]['title'].unique()
        popular_interaction_count = item_popularity.head(top_n).values
        popular_avg_rating = location_interactions.groupby('item_id')['rating'].mean().loc[popular_items].values

        # Return the top N popular items in the location along with their interaction count and average rating
        return pd.DataFrame({'item_id': popular_items, 'title': popular_titles,
                             'interaction_count': popular_interaction_count, 'avg_rating': popular_avg_rating})
