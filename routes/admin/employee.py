from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.employee as crud_employee
from dependencies.dependence import admin_required
from schemas import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=EmployeeResponse, dependencies=[Depends(admin_required)])
def create_employee(employee_create: EmployeeCreate, db: Session = Depends(get_db)):
    if crud_employee.get_employee_by_email(db, str(employee_create.email)):
        raise HTTPException(status_code=409, detail="Email уже используется")
    if crud_employee.get_employee_by_phone(db, employee_create.phone):
        raise HTTPException(status_code=409, detail="Телефон уже используется")
    db_employee = crud_employee.create_employee(db, employee_create)
    return db_employee


@router.get("/", response_model=list[EmployeeResponse], dependencies=[Depends(admin_required)])
def get_all_employees(skip: int = 0, limit: int = 15, search: str = '', db: Session = Depends(get_db)):
    return crud_employee.get_all_employees(db, skip=skip, limit=limit, search=search)


@router.get("/{employee_id}", response_model=EmployeeResponse, dependencies=[Depends(admin_required)])
def get_employee_by_id(employee_id: int, db: Session = Depends(get_db)):
    return crud_employee.get_employee_by_id(db, employee_id)


@router.put("/{employee_id}", response_model=EmployeeResponse, dependencies=[Depends(admin_required)])
def update_employee(employee_id: int, employee: EmployeeUpdate, db: Session = Depends(get_db)):
    db_employee = crud_employee.get_employee_by_id(db, employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Работник не найден")

    # Проверка email, если он меняется
    if employee.email and employee.email != db_employee.email:
        if crud_employee.get_employee_by_email(db, str(employee.email)):
            raise HTTPException(status_code=409, detail="Email уже используется")

    # Проверка phone, если он меняется
    if employee.phone and employee.phone != db_employee.phone:
        if crud_employee.get_employee_by_phone(db, employee.phone):
            raise HTTPException(status_code=409, detail="Телефон уже используется")

    return crud_employee.update_employee(db, db_employee, employee)


@router.delete("/{employee_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    if not crud_employee.delete_employee(db, employee_id):
        raise HTTPException(status_code=404, detail="Работник не найден")
