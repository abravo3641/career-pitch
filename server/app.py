import os
from dotenv import load_dotenv
import pyrebase
from flask import Flask, request, jsonify, make_response
from routes.auth import auth_route
from routes.applicant import applicant_route
from routes.recruiter import recruiter_route
from routes.db import db_route
from routes.job import job_route
from routes.applicantion import application_route

APP_ROOT = os.path.join(os.path.dirname(__file__), '..')                                                           
dotenv_path = os.path.join(APP_ROOT, '.env')
load_dotenv(dotenv_path)
app = Flask(__name__)

app.register_blueprint(auth_route,      url_prefix = "/api/auth")                                                    
app.register_blueprint(applicant_route, url_prefix = "/api/applicant")   
app.register_blueprint(recruiter_route, url_prefix = "/api/recruiter")     
app.register_blueprint(db_route,        url_prefix = "/api/db")
app.register_blueprint(job_route,       url_prefix = "/api/job")
app.register_blueprint(application_route, url_prefix = "/api/application")

@app.route('/', methods=['GET'])
def root():
    response =  jsonify({"code": 1, "message": 'home route'})
    return make_response(response, 201)

if __name__ == '__main__':
    app.run(debug=True)
 