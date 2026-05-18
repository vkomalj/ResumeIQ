import pandas as pd
from sklearn.linear_model import LinearRegression


def extract_skills(text):
    skills_list = ["python", "react", "node", "ml", "ai"]

    found = []
    for skill in skills_list:
        if skill.lower() in text.lower():
            found.append(skill)

    return found


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

    pred = model.predict([[exp, skills]])
    print("RAW PREDICTION:", pred)
    return pred[0]
    # return model.predict([[exp, skills]])
