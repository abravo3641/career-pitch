from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
from helpers.s3_config import upload_file, bucket_name, s3_client, s3_resource
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.job import Job
from models.application import Application

application_route = Blueprint("application", __name__)  

@application_route.route('/', methods=['GET'])
def get_application():
    applicant = request.args.get('applicant')
    recruiter = request.args.get('recruiter')
    role = request.args.get('role')
    application = session.query(Application).filter(Application.applicant == applicant, Application.recruiter == recruiter, Application.role == role).all()
    if not application:
        response =  jsonify({"code": -1, "message": "Application does not exists"})
        return make_response(response, 401)

    response =  jsonify({"code": 1, "application": application[0].to_json()})
    return make_response(response, 201) 

@application_route.route('/all', methods=['GET'])
def get_applications():
    applications = [application.to_json() for application in session.query(Application).all()]
    response = jsonify({"code": 1, "applications": applications})
    return make_response(response, 201)

@application_route.route('/', methods=['POST'])
def add_application():
    attributes = request.json
    application = Application(**attributes)
    try:
        session.add(application)
        session.commit()
        response =  jsonify({"code": 1, "message": "Successfully added application"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": -1, "message": "Application already exists"})
        return make_response(response, 401)

@application_route.route('/', methods=['DELETE'])
def remove_application():
    applicant = request.args.get('applicant')
    recruiter = request.args.get('recruiter')
    role = request.args.get('role')
    res = session.query(Application).filter(Application.applicant == applicant, Application.recruiter == recruiter, Application.role == role).delete()
    if res == 0:
        response =  jsonify({"code": -1, "message": "application not found"})
        return make_response(response, 401)
    
    #Delete static files from s3
    bucket = s3_resource.Bucket(bucket_name)
    bucket.objects.filter(Prefix=f'application/{recruiter}/{role}/{applicant}').delete()
    session.commit()
    response =  jsonify({"code": 1, "message": "Successfully deleted application"})
    return make_response(response, 201)

@application_route.route('/files', methods=['POST'])
def add_files():
    recruiter = request.args.get('recruiter')
    role = request.args.get('role')
    applicant = request.args.get('applicant')
    resume = request.files['myResume']
    cover = request.files['myCover']
    video = request.files['myVideo']
    files = [resume, cover, video]

    resume_destination = f'application/{recruiter}/{role}/{applicant}/{resume.filename}'
    cover_destination = f'application/{recruiter}/{role}/{applicant}/{cover.filename}'
    video_destination = f'application/{recruiter}/{role}/{applicant}/{video.filename}'
    destinations = [resume_destination, cover_destination, video_destination]
    
    resume_url = f'https://{bucket_name}.s3.amazonaws.com/' + resume_destination
    cover_url = f'https://{bucket_name}.s3.amazonaws.com/' + cover_destination
    video_url = f'https://{bucket_name}.s3.amazonaws.com/' + video_destination
    application = session.query(Application).filter(Application.applicant == applicant, Application.recruiter == recruiter, Application.role == role).all()
    if not application:
        response =  jsonify({"code": -1, "message": "Invalid Email or User not in DB"})
        return make_response(response, 401)
    
    #update applicant object with s3 obj url
    application[0].resume_name = resume_url
    application[0].cover_letter_name = cover_url
    application[0].video_name = video_url
    session.commit()
    
    #write files to s3
    for file, destination in zip(files, destinations):
        if file == video:
            upload_file(file, destination, video=True)
        else:
            upload_file(file, destination)

    response =  jsonify({"code": 1, "message": 'added files to application'})
    return make_response(response, 201)
