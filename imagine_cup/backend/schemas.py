from pydantic import BaseModel

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
