from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.job import Job
from models.application import Application

from helpers.firebase_config import auth
from helpers.db_helpers import add_object_to_db
auth_route = Blueprint("auth", __name__) 

@auth_route.route('/login', methods=['POST'])
def login():
    req = request.json
    try:
        token = auth.sign_in_with_email_and_password(req['email'], req['password'])                                 # Login-in Verificatrion -> (Returns error object if unsuccessful - error.message) gives token (idToken) and refresh token       
        user = auth.get_account_info(token['idToken'])                                                              # Get user info ()
        response =  jsonify({"code": "1", "message": "Successfully logged in "+req['email']+"!"})
        return make_response(response, 201)
    except:
        response =  jsonify({"code": "-1", "message": "Invalid Email or Password!"})
        return make_response(response, 401)

@auth_route.route('/register', methods=['POST'])
def register():
    req = request.json
    
    # CHECKING IF USER EXISTS IN SQL DB
    try:
        user_exists = session.query(Applicant).filter(Applicant.email == req["email"]).all()
    except:
        try: 
            user_exists = session.query(Recruiter).filter(Recruiter.email == req["email"]).all()
        except:
            response = jsonify({"code": -1, "message": "Couldn't Query SQL database for user "+req["email"]+" of user type Applicant nor Recruiter!"})
            return make_response(response, 401)
    if len(user_exists) > 0:
        response = jsonify({"code": -1, "message": "User "+req["email"]+" already exists in SQL DB!"})
        return make_response(response, 401)

    # ADDING USER TO SQL DB 
    if req["recruiter"]:                                                                                                                            
        attr = ['email', 'name', 'company', 'role', 'company_logo_name', 'company_info']
        data = [(req['email'], '-', '-','-','-','-')]
        user_type = Recruiter
    else:
        attr = ['email', 'name', 'school_name', 'school_year', 'gpa', 'current_location', 'picture_name']
        data = [(req['email'], '-','-','-',3.84,'-','-')]
        user_type = Applicant
    try:
        add_object_to_db(attr, data, user_type)
    except:
        response = jsonify({"code": -1, "message": "Couldn't add User to SQL DB!"})
        return make_response(response, 401)

    # ADDING USER TO FIREBASE AUTH DB  
    try:                                                                                                                  
        token = auth.create_user_with_email_and_password(req['email'], req['password'])                             # Create user (Returns error object if unsuccessful - error.message)
        user = auth.get_account_info(token['idToken'])                                                              # (Returns error object if unsuccessful)   
        auth.send_email_verification(token['idToken'])                                                              # Send verification email to the user (will set emailVerified field in user object to true if user verifies email)
        response = jsonify({"code": 1, "message": "Successfully registered "+str(req['email'])+"!"})
        return make_response(response, 201)
    except:
        response = jsonify({"code": -1, "message": "Couldn't Register User to Firebase, User might exist!"})
        return make_response(response, 401)
    

@auth_route.route('/resetEmail', methods=['POST'])
def reset_email(): 
    req = request.json
    try:
        auth.send_password_reset_email(req['email'])   
        response = jsonify({"code": 1, "message": "Sent reset pasword email!"})
        return make_response(response, 200)
    except:  
        response = jsonify({"code": -1, "message": "Couldn't send reset pasword email!"})
        return make_response(response, 401)