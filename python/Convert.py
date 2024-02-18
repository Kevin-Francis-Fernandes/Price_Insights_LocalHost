import pandas as pd
df = pd.read_csv('output.csv', encoding='latin1')



# Keep only unique rows
unique_df = df.drop_duplicates()

# Write the DataFrame with unique rows to a new CSV file
unique_df.to_csv('unique.csv', index=False)
