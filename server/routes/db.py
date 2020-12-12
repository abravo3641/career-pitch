from flask import Flask, Blueprint, jsonify, make_response
from helpers.database_config import db, session
from helpers.db_helpers import add_object_to_db
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
        response =  jsonify({"code": 1, "message": "Database cleared successfully and reloaded schema"})
        return make_response(response, 201)
    except:
        response =  jsonify({"code": -1, "message": "Database not cleared"})
        return make_response(response, 401)

@db_route.route('/fill', methods=['POST'])
def fill_db():
    try:
        applicant_atrr = ['email', 'name', 'school_name', 'school_year', 'gpa', 'current_location', 'picture_name']
        applicants_data = [ ('jessica@gmail.com', 'Jessica','Queens College','Junior',3.04,'Queens, NY','https://career-pitch.s3.amazonaws.com/applicant/jessica%40gmail.com/jessica.png'),
                            ('robert@gmail.com', 'Robert','New York University','Senior',3.64,'Brooklyn, NY','https://career-pitch.s3.amazonaws.com/applicant/robert%40gmail.com/robert.png'),
                            ('jacob@gmail.com', 'Jacob', 'City College of New York','Freshman',3.11,'Manhattan, NY','https://career-pitch.s3.amazonaws.com/applicant/jacob%40gmail.com/jacob.png') 
        ]

        recruiter_attr = ['email', 'name', 'company', 'role', 'company_logo_name', 'company_info']
        recruiter_data = [ 
            ('elsa@ibm.com', 'Elsa', 'IBM','University Recruiter','https://career-pitch.s3.amazonaws.com/recruiter/elsa%40ibm.com/ibm.png','International Business Machines (IBM), is a global technology company that provides hardware, software, cloud-based services and cognitive computing.International Business Machines Corporation is an American multinational technology and consulting company headquartered in Armonk, New York, with more than 350,000 employees serving clients in 170 countries'),
            ('lima@fb.com', 'Lima', 'Facebook','Tech Talent Recruiter','https://career-pitch.s3.amazonaws.com/recruiter/lima%40fb.com/facebook.png','At Facebook, we are constantly iterating, solving problems and working together to connect people all over the world. That’s why it’s important that our workforce reflects the diversity of the people we serve. Hiring people with different backgrounds and points of view helps us make better decisions, build better products and create better experiences for everyone'),
            ('emma@verizon.com', 'Emma', 'Verizon','Senior Recruiter','https://career-pitch.s3.amazonaws.com/recruiter/emma%40verizon.com/verizon.jpg','Verizon Communications Inc. was formed on June 30, 2000 and is celebrating its 20th year as one of the world’s leading providers of technology, communications, information and entertainment products and services. Our goal is to move the world forward for everyone by expanding digital access, protecting the climate, and preparing people for the jobs of the future') 
        ]

        job_atrr = ['recruiter_email', 'role', 'experience_level', 'location', 'salary']
        job_data = [  
            ('elsa@ibm.com','New Grad Backend','Fresh new grad out of college that will work in a dynamic, collaborative environment to understand requirements, design, code and test innovative applications, and support those applications for our highly valued customers','Yorktown, NY', 108000.00),
            ('elsa@ibm.com', 'New Grad Frontend', 'Fresh new grad out of college that will Work closely with designers to take wireframes from conception to implementation and design and improve user interfaces', 'San Francisco, CA', 103000.00),
            ('lima@fb.com', 'Junior iOS Developer', 'Been in the industry for 3+ years and will ensure quality and performance of application to specifications by identifying potential problems and resolving application bottlenecks', 'Seatle, WA', 130000.00),
            ('emma@verizon.com', 'Network Engineer', 'Been in industry for 2+ years. The growing telecomm industry features outstanding opportunities to find work. Applicants regularly find customer service and sales positions with corporations like Verizon, which maintains more than 175,000 employees and service areas connecting over 300 million people in the U.S', 'Denver, CO', 97000.00)
        ]

        application_attr = ['applicant', 'recruiter', 'role', 'status', 'video_name', 'resume_name', 'cover_letter_name']
        application_data = [  
            ('robert@gmail.com', 'elsa@ibm.com', 'New Grad Backend', 'submitted application', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/robert%40gmail.com/second.mp4', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/robert%40gmail.com/resume1.pdf', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/robert%40gmail.com/cover1.pdf'),
            ('robert@gmail.com', 'lima@fb.com', 'Junior iOS Developer', 'phone screen', 'https://career-pitch.s3.amazonaws.com/application/lima%40fb.com/Junior+iOS+Developer/robert%40gmail.com/second.mp4', 'https://career-pitch.s3.amazonaws.com/application/lima%40fb.com/Junior+iOS+Developer/robert%40gmail.com/resume3.pdf', 'https://career-pitch.s3.amazonaws.com/application/lima%40fb.com/Junior+iOS+Developer/robert%40gmail.com/cover3.pdf'),
            ('jessica@gmail.com', 'elsa@ibm.com', 'New Grad Frontend', 'onsite', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Frontend/jessica%40gmail.com/first.mp4', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Frontend/jessica%40gmail.com/resume2.pdf', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Frontend/jessica%40gmail.com/cover2.pdf'),
            ('jacob@gmail.com', 'elsa@ibm.com', 'New Grad Backend', 'submitted application', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/jacob%40gmail.com/third.mp4', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/jacob%40gmail.com/resume4.pdf', 'https://career-pitch.s3.amazonaws.com/application/elsa%40ibm.com/New+Grad+Backend/jacob%40gmail.com/cover4.pdf')
        ]

        add_object_to_db(applicant_atrr, applicants_data, Applicant)
        add_object_to_db(recruiter_attr, recruiter_data, Recruiter)
        add_object_to_db(job_atrr, job_data, Job)
        add_object_to_db(application_attr, application_data, Application)
        response =  jsonify({"code": 1, "message": "Succesfully inserted dummy data"})
        return make_response(response, 201)
    except:
        session.rollback()
        response =  jsonify({"code": -1, "message": "Dummy data can't be inserted. Try clearning db."})
        return make_response(response, 401)
