from sqlalchemy.orm import Session
from models import Employee
from schemas import EmployeeCreate, EmployeeUpdate


def create_employee(db: Session, employee: EmployeeCreate) -> Employee:
    db_employee = Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee


def get_employee_by_id(db: Session, employee_id: int) -> Employee | None:
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()


def get_all_employees(db: Session) -> list[Employee]:
    return db.query(Employee).all()


def update_employee(db: Session, employee_id: int, employee_data: EmployeeUpdate) -> Employee | None:
    db_employee = get_employee_by_id(db, employee_id)
    if not db_employee:
        return None
    for key, value in employee_data.model_dump(exclude_unset=True).items():
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
