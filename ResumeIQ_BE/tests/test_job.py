from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_create_job():
    payload = {"min_experience": "2", "required_skills": ["Python", "FastAPI"]}

    response = client.post("/create-job", json=payload)

    assert response.status_code == 422
    assert response.status_code == 200

    data = response.json()
    assert "data" in data
    assert "id" in data["data"]
    assert data["data"]["title"] == "Backend Developer"


# def test_get_jobs():
#     response = client.get("/jobs")
#
#     assert response.status_code == 200
#     assert isinstance(response.json(), list)
#
#
# def test_delete_job():
#     # First create job
#     payload = {
#         "title": "Temp Job",
#         "description": "Delete test",
#         "skills": ["Test"]
#     }
#
#     create_res = client.post("/create-job", json=payload)
#     job_id = create_res.json()["id"]
#
#     # Now delete
#     response = client.delete(f"/jobs/{job_id}")
#
#     assert response.status_code == 200
