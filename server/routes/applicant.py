from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
from helpers.s3_config import upload_file, bucket_name, s3_client, s3_resource
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.job import Job
from models.application import Application
applicant_route = Blueprint("applicant", __name__)    

@applicant_route.route('/', methods=['GET'])
def get_applicant():
    email = request.args.get('email')
    applicant = session.query(Applicant).filter(Applicant.email == email).all()
    if not applicant:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)

    response =  jsonify({"code": 1, "applicant": applicant[0].to_json()})
    return make_response(response, 201)

@applicant_route.route('/all', methods=['GET'])
def get_applicants():
    applicants = [applicant.to_json() for applicant in session.query(Applicant).all()]
    response = jsonify({"code": 1, "applicants": applicants})
    return make_response(response, 201)

@applicant_route.route('/', methods=['POST'])
def add_applicant():
    attributes = request.json
    applicant = Applicant(**attributes)
    try:
        session.add(applicant)
        session.commit()
        response =  jsonify({"code": 1, "message": "Successfully added applicant"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": -1, "message": "Email already exists"})
        return make_response(response, 401)

@applicant_route.route('/', methods=['DELETE'])
def delete_applicant():
    email = request.args.get('email')
    res = session.query(Applicant).filter(Applicant.email == email).delete()
    if res == 0:
        response =  jsonify({"code": -1, "message": "Email not found"})
        return make_response(response, 401)

    #delete profile pic from s3
    bucket = s3_resource.Bucket(bucket_name)
    bucket.objects.filter(Prefix=f'applicant/{email}').delete()
    session.commit()
    response =  jsonify({"code": 1, "message": "Successfully deleted applicant"})
    return make_response(response, 201)

@applicant_route.route('/profile_pic', methods=['POST'])
def adding_profile_pic():
    email = request.args.get('email')
    file = request.files['myFile']
    file_name = file.filename
    destination = f'applicant/{email}/{file_name}'
    upload_file(file, destination)
    #update applicant object with s3 obj url
    obj_url = f'https://{bucket_name}.s3.amazonaws.com/applicant/{email}/{file_name}'
    applicant = session.query(Applicant).filter(Applicant.email == email).all()
    if not applicant:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)
        
    applicant[0].picture_name = obj_url
    session.commit()
    response =  jsonify({"code": 1, "message": 'testing route'})
    return make_response(response, 201)


@applicant_route.route('/jobs', methods=['GET'])
def get_applied_jobs():
    email = request.args.get('email')
    applicant = session.query(Applicant).filter(Applicant.email == email).all()
    if not applicant:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)

    jobs_applied = [job.to_json() for job in applicant[0].jobs]
    response =  jsonify({"code": 1, "jobs": jobs_applied})
    return make_response(response, 201)
