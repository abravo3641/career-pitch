from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session#, db
from models.recruiter import Recruiter
from helpers.db_helpers import add_object_to_db

recruiter_route = Blueprint("recruiter", __name__)    

@recruiter_route.route('/', methods=['GET'])
def get_recruiter():
    email = request.args.get('email')
    recruiter = session.query(Recruiter).filter(Recruiter.email == email).all()
    if not recruiter:
        response =  jsonify({"code": "-1", "message": "Invalid Email"})
        return make_response(response, 401)
    response =  jsonify({"code": "1", "recruiter": recruiter[0].to_json()})
    return make_response(response, 201)

