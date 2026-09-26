import pandas as pd

file_path = '/Users/user/Downloads/Company Metrics Data (1).xlsx'
try:
    df = pd.read_excel(file_path)
    print("Columns:", df.columns.tolist())
    print("\nFirst 5 rows:")
    print(df.head())
except Exception as e:
    print(f"Error reading Excel file: {e}")
