# TEMPORARY PLAIN TEXT AUTH - REPLACE WITH JWT LATER
def hash_password(password: str) -> str:
    return password  # TODO: Use bcrypt or JWT

def verify_password(password: str, hashed: str) -> bool:
    return password == hashed
