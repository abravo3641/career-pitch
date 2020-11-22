DROP TABLE IF EXISTS Application;
DROP TABLE IF EXISTS Job;
DROP TABLE IF EXISTS Applicant;
DROP TABLE IF EXISTS Recruiter;

CREATE TABLE Applicant(
    name VARCHAR(30),
    email VARCHAR(30),
    school VARCHAR(30),
    year INT,
    GPA DECIMAL(4, 2),
    last_company_name VARCHAR(30),
    last_company_role VARCHAR(30),
    languages VARCHAR(300),
    location VARCHAR(30),
    interest VARCHAR(30),
    picture_name VARCHAR(30),
    PRIMARY KEY (email)
);

CREATE TABLE Recruiter(
    name VARCHAR(30),
    email VARCHAR(30),
    company VARCHAR(30),
    role VARCHAR(30),
    company_logo_name VARCHAR(30),
    company_info VARCHAR(300),
    PRIMARY KEY (email)
);

CREATE TABLE Job(
    recruiter VARCHAR(30),
    role VARCHAR(30),
    experience_level VARCHAR(30),
    location VARCHAR(30),
    salary DECIMAL(5, 2),
    PRIMARY KEY (recruiter, role),
    FOREIGN KEY (recruiter)
        REFERENCES Recruiter(email)
        ON DELETE CASCADE 
);

CREATE TABLE Application(
    applicant VARCHAR(30),
    recruiter VARCHAR(30),
    role VARCHAR(30),
    status VARCHAR(30),
    video_name VARCHAR(30),
    resume_name VARCHAR(30),
    cover_letter_name VARCHAR(30),
    PRIMARY KEY (applicant, recruiter, role),
    FOREIGN KEY (applicant)
        REFERENCES Applicant(email)
        ON DELETE CASCADE,
    FOREIGN KEY (recruiter, role)
        REFERENCES Job(recruiter, role)
        ON DELETE CASCADE
);
