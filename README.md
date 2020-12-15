The content below is an example submission document. Replace the text below the lines marked "__TODO__" with details specific to your project. Remove the "TODO" lines.


# Career Pitch


## Overview

A lot of the events that normally would have happened in person are now being held virtually due to social distancing guidelines. One of these events are conferences such as SHPE, SASE and Grace Hopper which give the opportunity for underrepresented groups to connect with different individuals. One of the most important events is the career fair which has shifted to a virtual environment, but we have experienced first hand that the experience is not the same. Conferences such as SASE and Tapia are only allowing students to chat to employers and never get that in person experience. Our goal is to build a platform that would try to offer a similar experience as an in person event. It will also allow long distance fairs, a more viable option and help increase the outreach of both Employers and potential candidates. Users can store their information and share their skills in a much efficient manner while the Employers will also be able to screen candidates with much more dataset allowing them to choose the best candidates for them to follow up with. This makes attending fairs much less tedious and let candidates focus more on the companies/organizations they are interested in joining.

## Getting Started
(___TODO__: These instructions will get you a copy of the project up and running on your local machine for development and testing purposes_)


## Requirements

(___TODO__: List out any technologies needed to run your project_)


## Data Model

(___TODO__: A description of your application's data and their relationships to each other_)

The application will store user, items, and orders.

- Users can have many orders.
- Orders can have many items.

(___TODO__: Sample resources_)

An Example `User`:

```javascript
{
  id: 5,
  firstName: "Mary",
  lastName: "Jane"
}
```

An Example `Item`:

```javascript
{
  id: 3,
  name: "Lamp",
  price: "$19.99"
}
```

An Example `Order`:

```javascript
{
  id: 1,
  user_id: 5,// a reference to a User object
}
```

An Example `OrderItems`:

```javascript
{
  item_id: 3,
  order_id: 1 // References an Order object
}
```

## Site map

https://www.figma.com/file/ESf6D4WlJP5rQdGF9OD8Gz/Career-Pitch?node-id=0%3A1

## User Stories or Use Cases

(___TODO__: Write out how your application will be used through [user stories](http://en.wikipedia.org/wiki/User_story#Format)_)

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
https://www.sqlalchemy.org/
https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3.html
https://blog.miguelgrinberg.com/post/how-to-deploy-a-react--flask-project

## Authors
Anthony Bravo
Aninda Halder
Mahmudul Hasan
