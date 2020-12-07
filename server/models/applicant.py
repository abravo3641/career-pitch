from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import relationship
from models.base import Base

class Applicant(Base):  
    __tablename__ = 'applicant'
    email = Column(String, primary_key=True)
    name = Column(String)
    school = Column(String)
    year = Column(Integer)
    gpa = Column(Float)
    location = Column(String)
    picture_name = Column(String)
    applications = relationship('Job', secondary='application', back_populates='applicants')

    def to_json(self):
        return {
            "email": self.email,
            "name": self.name,
            "school": self.school,
            "year": self.year,
            "gpa": self.gpa,
            "location": self.location,
            "picture_name": self.picture_name
        }

    def __repr__(self):
        return f'<Applicant({self.email})>'
    
