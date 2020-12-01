from sqlalchemy import Column, String, ForeignKey, ForeignKeyConstraint
from models.base import Base  

class Application(Base):
    __tablename__ = 'application'
    applicant = Column(String, ForeignKey('applicant.email', ondelete='CASCADE'), primary_key=True)
    recruiter = Column(String, primary_key=True)
    role = Column(String, primary_key=True)
    status = Column(String)
    video_name = Column(String)
    resume_name = Column(String)
    cover_letter_name = Column(String)
    __table_args__ = (
        ForeignKeyConstraint(
            ['recruiter', 'role'],
            ['job.recruiter_email', 'job.role'],
            ondelete='CASCADE'
        ),
    )

    def __repr__(self):
        return f'<Application({self.applicant}, {self.recruiter}, {self.role})>'
        