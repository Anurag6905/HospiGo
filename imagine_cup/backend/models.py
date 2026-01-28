from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Hospital(Base):
    __tablename__ = "hospitals"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    latitude = Column(Float)
    longitude = Column(Float)
    password_hash = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    password = Column(String)

class Bed(Base):
    __tablename__ = "beds"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    total_beds = Column(Integer)
    available_beds = Column(Integer)
    hospital = relationship("Hospital")

class OPD(Base):
    __tablename__ = "opds"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    department = Column(String)
    queue_length = Column(Integer)
    hospital = relationship("Hospital")

class Equipment(Base):
    __tablename__ = "equipment"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    name = Column(String)
    quantity = Column(Integer)
    hospital = relationship("Hospital")

class Specialist(Base):
    __tablename__ = "specialists"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    name = Column(String)
    specialty = Column(String)
    timing = Column(String)
    hospital = relationship("Hospital")

class BedBooking(Base):
    __tablename__ = "bed_bookings"
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, ForeignKey("hospitals.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")
    hospital = relationship("Hospital")
    user = relationship("User")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    specialist_id = Column(Integer, ForeignKey("specialists.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="pending")
    specialist = relationship("Specialist")
    user = relationship("User")
