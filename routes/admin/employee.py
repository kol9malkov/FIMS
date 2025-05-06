from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.employee as crud_employee
from schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=EmployeeResponse)
def create_employee(employee_create: EmployeeCreate, db: Session = Depends(get_db)):
    return crud_employee.create_employee(db, employee_create)


@router.get("/", response_model=list[EmployeeResponse])
def get_all_employees(db: Session = Depends(get_db)):
    return crud_employee.get_all_employees(db)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee_by_id(employee_id: int, db: Session = Depends(get_db)):
    return crud_employee.get_employee_by_id(db, employee_id)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    updated_employee = crud_employee.update_employee(db, employee_id, employee)
    if updated_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return updated_employee


@router.delete("/{employee_id}")
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    success = crud_employee.delete_employee(db, employee_id)
    if not success:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"detail": "Employee deleted successfully"}
