import pandas as pd
import numpy as np

# Define the size of the matrix
rows = 5
cols = 5

# Generate random numbers for the matrix
data = np.random.randint(0, 100, size=(rows, cols))

# Create a DataFrame from the random data
df = pd.DataFrame(data)

print("Randomized 2D Matrix:")
print(df)
