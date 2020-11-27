from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.firebase_config import auth
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
    try:
        token = auth.create_user_with_email_and_password(req['email'], req['password'])                             # Create user (Returns error object if unsuccessful - error.message)
        user = auth.get_account_info(token['idToken'])                                                              # (Returns error object if unsuccessful)
        auth.send_email_verification(token['idToken'])                                                              # Send verification email to the user (will set emailVerified field in user object to true if user verifies email)
        response = jsonify({"code": "1", "message": "Successfully registered "+req['email']+"!"})
        return make_response(response, 201)
    except:
        response = jsonify({"code": "-1", "message": "Couldn't Register User, User might exist!"})
        return make_response(response, 401)

@auth_route.route('/resetEmail', methods=['POST'])
def reset_email(): 
    req = request.json
    try:
        auth.send_password_reset_email(req['email'])   
        response = jsonify({"code": "1", "message": "Sent reset pasword email!"})
        return make_response(response, 200)
    except:  
        response = jsonify({"code": "-1", "message": "Couldn't send reset pasword email!"})
        return make_response(response, 401)