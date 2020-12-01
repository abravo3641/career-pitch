from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from models.base import Base

class Recruiter(Base):  
    __tablename__ = 'recruiter'
    email = Column(String, primary_key=True)
    name = Column(String)
    company = Column(String)
    role = Column(String)
    company_logo_name = Column(String)
    company_info = Column(String)
    jobs = relationship("Job", back_populates="recruiter")

    def __repr__(self):
        return f'<Recruiter({self.email})>'
