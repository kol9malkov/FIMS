from sqlalchemy.orm import Session
from models import Employee
from schemas import EmployeeCreate, EmployeeUpdate
from sqlalchemy import or_


def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def get_employee_by_email(db: Session, email: str) -> Employee | None:
    return db.query(Employee).filter(Employee.email == email).first()


def get_employee_by_phone(db: Session, phone: str) -> Employee | None:
    return db.query(Employee).filter(Employee.phone == phone).first()


def get_employee_by_id(db: Session, employee_id: int) -> Employee | None:
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_all_employees(db: Session, skip: int = 0, limit: int = 15, search: str = ''):
    query = db.query(Employee)

    if search:
        query = query.filter(
            or_(
                Employee.first_name.ilike(f"%{search}%"),
                Employee.last_name.ilike(f"%{search}%"),
                Employee.position.ilike(f"%{search}%")
            )
        )
    return query.offset(skip).limit(limit).all()


def update_employee(db: Session, db_employee: Employee, update_data: EmployeeUpdate) -> Employee:
    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(db_employee, key, value)

    db.commit()
    db.refresh(db_employee)
    return db_employee


def delete_employee(db: Session, employee_id: int) -> bool:
    db_employee = get_employee_by_id(db, employee_id)
    if not db_employee:
        return False
    db.delete(db_employee)
    db.commit()
    return True
