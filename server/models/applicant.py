from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import relationship
from models.base import Base

class Applicant(Base):  
    __tablename__ = 'applicant'
    email = Column(String, primary_key=True)
    name = Column(String)
    school_name = Column(String)
    school_year = Column(String)
    gpa = Column(Float)
    current_location = Column(String)
    picture_name = Column(String)
    applications = relationship('Job', secondary='application', back_populates='applicants')

    def to_json(self):
        return {
          "email": self.email,
          "name": self.name,
          "school_name": self.school_name,
          "school_year": self.school_year,
          "gpa": self.gpa,
          "current_location": self.current_location,
          "picture_name": self.picture_name
        }
    def __repr__(self):
        return f'<Applicant({self.email})>'
    
