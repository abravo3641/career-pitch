from flask import Flask, Blueprint, jsonify, make_response
from helpers.database_config import db, session
from models.base import Base
from models.applicant import Applicant
from models.recruiter import Recruiter
from models.job import Job
from models.application import Application

db_route = Blueprint("db", __name__)   

@db_route.route('/clear', methods=['DELETE'])
def clear_db():
    try:
        Base.metadata.drop_all(bind=db)
        Base.metadata.create_all(db)
        response =  jsonify({"code": "1", "message": "Database cleared successfully and reloaded schema"})
        return make_response(response, 201)
    except:
        response =  jsonify({"code": "-1", "message": "Database not cleared"})
        return make_response(response, 401)

@db_route.route('/fill', methods=['POST'])
def fill_db():
    try:
        applicant_atrr = ['email', 'name', 'school', 'year', 'gpa', 'location', 'picture_name']
        applicants_data = [ ('abravo@gmail.com', 'anthony','ccny',5,3.84,'nyc','/applicant/abravo@gmail.jpg'),
                            ('aninda@gmail.com', 'aninda','ccny',5,3.94,'nyc','/applicant/aninda@gmail.jpg'),
                            ('hasan@gmail.com', 'hasan', 'ccny',5,3.91,'nyc','/applicant/hasan@gmail.jpg') ]

        recruiter_attr = ['email', 'name', 'company', 'role', 'company_logo_name', 'company_info']
        recruiter_data = [  ('elsa@ibm.com', 'elsa', 'ibm','university recruiter','/company/ibm.jpg','good company'),
                            ('lima@fb.com', 'lima', 'facebook','tech talent recruiter','/company/facebook.jpg','good company'),
                            ('emma@verizon.com', 'emma', 'verizon','Senior recruiter','/company/verizon.jpg','good company') ]

        job_atrr = ['recruiter_email', 'role', 'experience_level', 'location', 'salary']
        job_data = [  ('elsa@ibm.com','new grad back end','0 years','yorktown, NY', 100000.00),
                      ('elsa@ibm.com', 'senior front end', '7+ years', 'san francisco, CA', 178000.00),
                      ('lima@fb.com', 'junior ios mobile', '1+ years', 'Seatle', 130000.00) ]

        application_attr = ['applicant', 'recruiter', 'role', 'status', 'video_name', 'resume_name', 'cover_letter_name']
        application_data = [  ('abravo@gmail.com', 'elsa@ibm.com', 'new grad back end', 'submitted application', '/applications/ibm/abravo@gmail_new_grad_back_end_video.mp4', '/applications/ibm/abravo@gmail_new_grad_back_end_resume.pdf', '/applications/ibm/abravo@gmail_new_grad_back_end_cover.pdf'),
                              ('abravo@gmail.com', 'lima@fb.com', 'junior ios mobile', 'phone screen', '/applications/facebook/abravo@gmail_junior_ios_mobile_video.mp4', '/applications/facebook/abravo@gmail_junior_ios_mobile_resume.pdf', '/applications/facebook/abravo@gmail_junior_ios_mobile_cover.pdf'),
                              ('hasan@gmail.com', 'elsa@ibm.com', 'new grad back end', 'onsite', '/applications/ibm/hasan@new_grad_back_end_video.mp4', '/applications/ibm/hasan@new_grad_back_end_resume.pdf', '/applications/ibm/hasan@new_grad_back_end_cover.pdf') ]

        add_object_data(applicant_atrr, applicants_data, Applicant)
        add_object_data(recruiter_attr, recruiter_data, Recruiter)
        add_object_data(job_atrr, job_data, Job)
        add_object_data(application_attr, application_data, Application)
        response =  jsonify({"code": "1", "message": "Succesfully inserted dummy data"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": "-1", "message": "Dummy data can't be inserted. Try clearning db."})
        return make_response(response, 401)



def add_object_data(atrr, data_arr, clss):
    for data in data_arr:
        d = dict(zip(atrr, data))
        obj = clss(**d)
        session.add(obj)
    session.commit()
    