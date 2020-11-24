import os
import sys
from dotenv import load_dotenv
import pyrebase
from flask import Flask, request, jsonify, make_response

APP_ROOT = os.path.join(os.path.dirname(__file__), '..')                                                            # adding dotenv
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)

app = Flask(__name__)

config = {
    "apiKey": os.getenv('API_KEY'),                                                                                 # Firebase - copied from 'firebaseConfig' in firebase
    "authDomain": "career-pitch.firebaseapp.com",
    "databaseURL": "https://career-pitch.firebaseio.com",
    "projectId": "career-pitch",
    "storageBucket": "career-pitch.appspot.com",
    "messagingSenderId": os.getenv('MESSAGING_SENDER_ID'),
    "appId": "1:359388233171:web:4c28285ae3cccf38698326",
    "measurementId": "G-GQEBBRL3T6"
}
firebase = pyrebase.initialize_app(config)
auth = firebase.auth() 

@app.route('/', methods=['GET'])
def root():
	return 'home route'

@app.route('/api/auth/login', methods=['POST'])
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

@app.route('/api/auth/register', methods=['POST'])
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

@app.route('/api/auth/resetEmail', methods=['POST'])
def reset_email(): 
    req = request.json
    try:
        auth.send_password_reset_email(req['email'])   
        response = jsonify({"code": "1", "message": "Sent reset pasword email!"})
        return make_response(response, 200)
    except:  
        response = jsonify({"code": "-1", "message": "Couldn't send reset pasword email!"})
        return make_response(response, 401)

if __name__ == '__main__':
    app.run(debug=True)
