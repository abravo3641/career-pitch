

# Career Pitch
- Deployed Link: http://ec2-54-211-232-103.compute-1.amazonaws.com/
- Slides: https://bit.ly/3gQWBR1
- Demo Video: https://bit.ly/37nBjHF

## Overview

A lot of the events that normally would have happened in person are now being held virtually due to social distancing guidelines. One of these events are conferences such as SHPE, SASE and Grace Hopper which give the opportunity for underrepresented groups to connect with different individuals. One of the most important events is the career fair which has shifted to a virtual environment, but we have experienced first hand that the experience is not the same. Conferences such as SASE and Tapia are only allowing students to chat to employers and never get that in person experience. Our goal is to build a platform that would try to offer a similar experience as an in person event. It will also allow long distance fairs, a more viable option and help increase the outreach of both Employers and potential candidates. Users can store their information and share their skills in a much efficient manner while the Employers will also be able to screen candidates with much more dataset allowing them to choose the best candidates for them to follow up with. This makes attending fairs much less tedious and let candidates focus more on the companies/organizations they are interested in joining.

## Getting Started

The Backend Dev Setup:
- Have Python3 on the system
- Clone this app
- Start Virtual Environemnt with Python3 
- Run
```bash
# Back-End terminal 1
cd server
cp .env.example .env
pyenv local 3.8.5
virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```
The Frontend Dev Setup:
- Install Node 10.16.0 on the system
```bash
# Front-End terminal 2
cd client
cp .env.example .env
npm install
npm start
```
- Backend-Server will run at: http://localhost:5000
- Frontend-Client will run at: http://localhost:3000

## Requirements

- Node 
- Python
- AWS
- Firebase
- Postgres
- React and React Bootstrap
- Active Acces to Internet


## Data Model


- Applicant:
Name,
Email (K),
School,
Year,
GPA,
Location,
Picture_name

- Recruiter:
name,
email (K),
company,
role,
company_logo,
company_info


- Jobs:
Recruiter (FK) - email,	
Role,
Experience Level,
Location,
Salary


- Applications:
Applicant (FK),
Job (FK),
Status,
Video_name,
Resume_name,
Cover_letter_name


An Example `Applicant`:

```javascript
{
    "email": "bravo@gmail.com",
    "gpa": 3.84,
    "location": "nyc",
    "name": "anthony",
    "picture_name": "/applicant/abravo@gmail.jpg",
    "school": "ccny",
    "year": 5
}
```


An Example `Recruiter`:

```javascript
{
    "email": "elsa2@ibm.com",
    "company": "ibm",
    "company_info": "good company",
    "company_logo_name": "/company/ibm.jpg",
    "name": "elsa2",
    "role": "university recruiter"
}
```

An Example `Jobs`:

```javascript
{
  "recruiter-email":"elsa@ibm.com",
  "role":"frontend developer",
  "experience-level":"Entry level",
  "location":"NYC"
  "salary":"85k-90k"
}

```
An Example `Applications`:

```javascript
{
  "applicant-email":"elsa@hotmail.com",
  "job":"frontend developer",
  "status":"Pending",
  "Video_name":fileobj,
  "resume_name":fileobj,
  "Cover_letter": fileobj
  
}
```

## Site map

https://www.figma.com/file/ESf6D4WlJP5rQdGF9OD8Gz/Career-Pitch?node-id=0%3A1

## User Stories or Use Cases


1. As non-registered applicant, I can create a new account on the site.
2. As non-registered recruiter, I can create a new account on the site.
3. As a applicant, I can log into the site.
4. As a recruiter, I can log into the site.
5. As an applicant I can view all the job posting that are avaliable
6. As an applicant, I can apply to a job by uploading my resume, cover letter and vide pitch for that specific job.
7. As an applicant, I can view my past applied jobs to keep track of their history.
8. As a recruiter, I can post a job by adding all the information related to that job. 
9. As a recruiter, I can view all applicants that have applied to the jobs I have posted. 
10. As a recruiter, I can view the applicant information for the job they have applied for. (Resume, cover letter & video).
11. As a recruiter, I can also see a list of all applicants in the platform. 
12. As an applicant, I can log out of the site.
13. As a recruiter, I can log out of the site.

## References Used
- https://www.sqlalchemy.org/
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html
- https://blog.miguelgrinberg.com/post/how-to-deploy-a-react--flask-project

## Authors
- Anthony Bravo
- Aninda Halder
- Mahmudul Hasan


