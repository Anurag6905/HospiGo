from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship, Session
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./healthcare.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Pydantic Schemas
class HospitalRegister(BaseModel):
    name: str
    latitude: float
    longitude: float
    password: str

class HospitalLogin(BaseModel):
    name: str
    password: str

class UserRegister(BaseModel):
    name: str
    password: str

class UserLogin(BaseModel):
    name: str
    password: str

class BedUpdate(BaseModel):
    total_beds: int
    available_beds: int

class OPDCreate(BaseModel):
    department: str
    queue_length: int

class EquipmentCreate(BaseModel):
    name: str
    quantity: int

class SpecialistCreate(BaseModel):
    name: str
    specialty: str
    timing: str

class BedBookingCreate(BaseModel):
    user_id: int

class AppointmentCreate(BaseModel):
    user_id: int

# Database Models
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

# Auth functions (temporary - replace with JWT later)
def hash_password(password: str) -> str:
    return password  # TODO: Use bcrypt

def verify_password(password: str, hashed: str) -> bool:
    return password == hashed

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Smart City Healthcare Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"status": "Backend running"}

# Hospital endpoints
@app.post("/hospital/register")
def register_hospital(data: HospitalRegister, db: Session = Depends(get_db)):
    existing = db.query(Hospital).filter(Hospital.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Hospital already exists")
    
    hospital = Hospital(
        name=data.name,
        latitude=data.latitude,
        longitude=data.longitude,
        password_hash=hash_password(data.password)
    )
    db.add(hospital)
    db.commit()
    db.refresh(hospital)
    return {"message": "Hospital registered", "hospital_id": hospital.id}

@app.post("/hospital/login")
def hospital_login(data: HospitalLogin, db: Session = Depends(get_db)):
    hospital = db.query(Hospital).filter(Hospital.name == data.name).first()
    if not hospital or not verify_password(data.password, hospital.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "hospital_id": hospital.id}

# User endpoints
@app.post("/user/register")
def register_user(data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    
    user = User(
        name=data.name,
        password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "User registered", "user_id": user.id}

@app.post("/user/login")
def user_login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.name == data.name).first()
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "user_id": user.id}

# Bed management
@app.post("/hospital/{hospital_id}/beds")
def update_beds(hospital_id: int, data: BedUpdate, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.hospital_id == hospital_id).first()
    
    if bed:
        bed.total_beds = data.total_beds
        bed.available_beds = data.available_beds
    else:
        bed = Bed(hospital_id=hospital_id, total_beds=data.total_beds, available_beds=data.available_beds)
        db.add(bed)
    
    db.commit()
    db.refresh(bed)
    return {"message": "Beds updated", "total": bed.total_beds, "available": bed.available_beds}

@app.get("/hospitals/beds")
def view_beds(db: Session = Depends(get_db)):
    beds = db.query(Bed).all()
    return [{"hospital_id": b.hospital_id, "total": b.total_beds, "available": b.available_beds} for b in beds]

# OPD endpoints
@app.post("/hospital/{hospital_id}/opd")
def add_opd(hospital_id: int, data: OPDCreate, db: Session = Depends(get_db)):
    opd = OPD(hospital_id=hospital_id, department=data.department, queue_length=data.queue_length)
    db.add(opd)
    db.commit()
    db.refresh(opd)
    return {"message": "OPD updated", "opd_id": opd.id}

@app.get("/hospitals/opd")
def view_opd(db: Session = Depends(get_db)):
    opds = db.query(OPD).all()
    return [{"hospital_id": o.hospital_id, "department": o.department, "queue": o.queue_length} for o in opds]

# Equipment endpoints
@app.post("/hospital/{hospital_id}/equipment")
def add_equipment(hospital_id: int, data: EquipmentCreate, db: Session = Depends(get_db)):
    equipment = Equipment(hospital_id=hospital_id, name=data.name, quantity=data.quantity)
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return {"message": "Equipment added", "equipment_id": equipment.id}

@app.get("/hospitals/equipment")
def view_equipment(db: Session = Depends(get_db)):
    equipments = db.query(Equipment).all()
    return [{"hospital_id": e.hospital_id, "name": e.name, "quantity": e.quantity} for e in equipments]

# Specialist endpoints
@app.post("/hospital/{hospital_id}/specialists")
def add_specialist(hospital_id: int, data: SpecialistCreate, db: Session = Depends(get_db)):
    specialist = Specialist(hospital_id=hospital_id, name=data.name, specialty=data.specialty, timing=data.timing)
    db.add(specialist)
    db.commit()
    db.refresh(specialist)
    return {"message": "Specialist added", "specialist_id": specialist.id}

@app.get("/hospitals/specialists")
def view_specialists(db: Session = Depends(get_db)):
    specialists = db.query(Specialist).all()
    return [{"hospital_id": s.hospital_id, "name": s.name, "specialty": s.specialty, "timing": s.timing} for s in specialists]

# Booking endpoints
@app.post("/hospital/{hospital_id}/bed-book")
def book_bed(hospital_id: int, data: BedBookingCreate, db: Session = Depends(get_db)):
    bed = db.query(Bed).filter(Bed.hospital_id == hospital_id).first()
    if not bed or bed.available_beds <= 0:
        raise HTTPException(status_code=400, detail="No beds available")
    
    booking = BedBooking(hospital_id=hospital_id, user_id=data.user_id)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return {"message": "Bed booking request sent", "booking_id": booking.id}

@app.get("/hospital/{hospital_id}/bed-requests")
def view_bed_requests(hospital_id: int, db: Session = Depends(get_db)):
    bookings = db.query(BedBooking).filter(BedBooking.hospital_id == hospital_id).all()
    return [{"booking_id": b.id, "user_id": b.user_id, "status": b.status} for b in bookings]

@app.post("/specialist/{specialist_id}/book")
def book_appointment(specialist_id: int, data: AppointmentCreate, db: Session = Depends(get_db)):
    appointment = Appointment(specialist_id=specialist_id, user_id=data.user_id)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return {"message": "Appointment request sent", "appointment_id": appointment.id}

@app.get("/specialist/{specialist_id}/appointments")
def view_appointments(specialist_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.specialist_id == specialist_id).all()
    return [{"appointment_id": a.id, "user_id": a.user_id, "status": a.status} for a in appointments]

# ✅ ADD THESE MISSING ROUTES (put after your existing specialist endpoints)

@app.put("/hospitals/specialists/{specialist_id}")
def update_specialist(specialist_id: int, data: SpecialistCreate, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")
    
    specialist.name = data.name
    specialist.specialty = data.specialty
    specialist.timing = data.timing
    
    db.commit()
    db.refresh(specialist)
    return {"message": "Specialist updated", "specialist": specialist}

@app.delete("/hospitals/specialists/{specialist_id}")
def delete_specialist(specialist_id: int, db: Session = Depends(get_db)):
    specialist = db.query(Specialist).filter(Specialist.id == specialist_id).first()
    if not specialist:
        raise HTTPException(status_code=404, detail="Specialist not found")
    
    db.delete(specialist)
    db.commit()
    return {"message": "Specialist deleted"}


@app.post("/hospitals/specialists")
def add_specialist_global(data: SpecialistCreate, db: Session = Depends(get_db)):
    specialist = Specialist(
        hospital_id=data.hospital_id or 1,  # Default hospital
        name=data.name, 
        specialty=data.specialty, 
        timing=data.timing
    )
    db.add(specialist)
    db.commit()
    db.refresh(specialist)
    return {"message": "Specialist added", "specialist_id": specialist.id}
