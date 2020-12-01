from flask import Flask, Blueprint, request, jsonify, make_response
from helpers.database_config import session, db
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
        response =  jsonify({"code": "-1", "message": "Invalid Email"})
        return make_response(response, 401)

    response =  jsonify({"code": "1", "applicant": applicant[0].to_json()})
    return make_response(response, 201)


@applicant_route.route('/all', methods=['GET'])
def get_applicants():
    applicants = [applicant.to_json() for applicant in session.query(Applicant).all()]
    response = jsonify({"code": "1", "applicants": applicants})
    return make_response(response, 201)


@applicant_route.route('/', methods=['POST'])
def put_applicant():
    attributes = request.json
    applicant = Applicant(**attributes)
    try:
        session.add(applicant)
        session.commit()
        response =  jsonify({"code": "1", "message": "Successfully added applicant"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": "-1", "message": "Email already exists"})
        return make_response(response, 401)


@applicant_route.route('/', methods=['DELETE'])
def delete_applicant():
    email = request.args.get('email')
    res = session.query(Applicant).filter(Applicant.email == email).delete()
    if res == 0:
        response =  jsonify({"code": "-1", "message": "Email not found"})
        return make_response(response, 401)

    session.commit()
    response =  jsonify({"code": "1", "message": "Successfully deleted applicant"})
    return make_response(response, 201)
