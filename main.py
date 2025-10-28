from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import json
import joblib

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

data = pd.read_json("data/employes_data.json")
age = data["age"]
revenu = data["revenu"]
experience = data["experience"]
revenu_par_secteur = data.groupby("secteur")["revenu"].mean().reset_index()
revenu_par_niveau = data.groupby("niveau_etude")["revenu"].mean().reset_index()
moyRevenue = float(revenu.mean())
moyAge = float(age.mean())
employes_par_ville = data["ville"].value_counts().mean()
employes_par_secteur = data["secteur"].value_counts().mean()

mymodel = joblib.load("models/mymodel.pkl")


@app.post("/model")
async def predict(body: dict):
    num1 = float(body.get("num1"))
    num2 = float(body.get("num2"))
    result = mymodel.predict(np.array([[num1, num2]]))
    return {"res": float(result[0])}


@app.get("/data")
def get_data():
    return {
        "age": age.tolist(),
        "revenu": revenu.tolist(),
        "revenu_par_secteur": json.loads(revenu_par_secteur.to_json(orient="records")),
        "revenu_par_niveau": json.loads(revenu_par_niveau.to_json(orient="records")),
        "revenu_moyen": moyRevenue,
        "experience": experience.tolist(),
        "moyAge": moyAge,
        "employes_par_ville": employes_par_ville,
        "employes_par_secteur": employes_par_secteur,
    }
