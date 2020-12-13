from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
from helpers.s3_config import upload_file, bucket_name, s3_client, s3_resource
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.application import Application
from models.job import Job
from helpers.db_helpers import add_object_to_db

recruiter_route = Blueprint("recruiter", __name__)    

@recruiter_route.route('/', methods=['GET'])
def get_recruiter():
    email = request.args.get('email')
    recruiter = session.query(Recruiter).filter(Recruiter.email == email).all()
    if not recruiter:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)
    response =  jsonify({"code": 1, "recruiter": recruiter[0].to_json()})
    return make_response(response, 201)

@recruiter_route.route('/all', methods=['GET'])
def get_recruiters():
    recruiters = [recruiter.to_json() for recruiter in session.query(Recruiter).all()]
    response = jsonify({"code": 1, "recruiter": recruiters})
    return make_response(response, 201)

@recruiter_route.route('/', methods=['POST'])
def add_recruiter():
    attributes = request.json
    recruiter = Recruiter(**attributes)
    try:
        session.add(recruiter)
        session.commit()
        response =  jsonify({"code": 1, "message": "Successfully added recruiter!"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": -1, "message": "Email already exists"})
        return make_response(response, 401)

@recruiter_route.route('/', methods=['DELETE'])
def delete_recruiter():
    email = request.args.get('email')
    res = session.query(Recruiter).filter(Recruiter.email == email).delete()
    if res == 0:
        response =  jsonify({"code": -1, "message": "Email not found!"})
        return make_response(response, 401)

    #delete company logo from s3
    bucket = s3_resource.Bucket(bucket_name)
    bucket.objects.filter(Prefix=f'recruiter/{email}').delete()
    bucket.objects.filter(Prefix=f'application/{email}').delete()
    session.commit()
    response =  jsonify({"code": 1, "message": "Successfully deleted recruiter!"})
    return make_response(response, 201)

@recruiter_route.route('/company_logo', methods=['POST'])
def adding_profile_pic():
    email = request.args.get('email')
    file = request.files['myFile']
    file_name = file.filename
    destination = f'recruiter/{email}/{file_name}'
    upload_file(file, destination)
    #update recruiter object with s3 obj url
    obj_url = f'https://{bucket_name}.s3.amazonaws.com/recruiter/{email}/{file_name}'
    recruiter = session.query(Recruiter).filter(Recruiter.email == email).all()
    if not recruiter:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)

    recruiter[0].company_logo_name = obj_url
    session.commit()
    response =  jsonify({"code": 1, "message": 'added company logo'})
    return make_response(response, 201)


@recruiter_route.route('/jobs', methods=['GET'])
def get_posted_jobs():
    email = request.args.get('email')
    recruiter = session.query(Recruiter).filter(Recruiter.email == email).all()
    if not recruiter:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)

    jobs = [job.to_json() for job in recruiter[0].jobs]
    response = jsonify({"code": 1, "jobs": jobs})
    return make_response(response, 201)
