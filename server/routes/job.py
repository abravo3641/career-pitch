from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.job import Job
from models.application import Application

job_route = Blueprint("job", __name__)

@job_route.route('/', methods=['GET'])
def get_job():
    recruiter_email = request.args.get('recruiter_email')
    role = request.args.get('role')
    job = session.query(Job).filter(Job.recruiter_email == recruiter_email, Job.role == role).all()
    if not job:
        response =  jsonify({"code": -1, "message": "Invalid Email or role"})
        return make_response(response, 401)

    response =  jsonify({"code": 1, "applicant": job[0].to_json()})
    return make_response(response, 201)

@job_route.route('/', methods=['POST'])
def add_job():
    attributes = request.json
    job = Job(**attributes)
    try:
        session.add(job)
        session.commit()
        response =  jsonify({"code": 1, "message": "Successfully added job"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": -1, "message": "role alreasy exist"})
        return make_response(response, 401)

@job_route.route('/all', methods=['GET'])
def get_jobs():
    jobs = [job.to_json() for job in session.query(Job).all()]
    response = jsonify({"code": 1, "jobs": jobs})
    return make_response(response, 201)
