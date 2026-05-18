import pandas as pd
from sklearn.linear_model import LinearRegression

# sample dataset
data = {
    "experience": [1, 2, 3, 4, 5],
    "skills": [2, 3, 5, 7, 9],
    "salary": [20000, 30000, 50000, 70000, 90000],
}

df = pd.DataFrame(data)

X = df[["experience", "skills"]]
y = df["salary"]

model = LinearRegression()
model.fit(X, y)


def predict_salary(exp, skills):
    return model.predict([[exp, skills]])[0]
