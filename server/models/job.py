from sqlalchemy import Column, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from models.base import Base 

class Job(Base):
    __tablename__ = 'job'
    recruiter_email = Column(String, ForeignKey('recruiter.email', ondelete='CASCADE'), primary_key=True)
    recruiter = relationship("Recruiter", back_populates="jobs")
    role = Column(String, primary_key=True)
    experience_level = Column(String)
    location = Column(String)
    salary = Column(Float)
    applicants = relationship('Applicant', secondary='application', back_populates='applications')

    def __repr__(self):
        return f'<Job({self.recruiter_email}, {self.role})>'
