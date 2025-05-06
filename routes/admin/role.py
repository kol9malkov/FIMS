from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import crud.role as crud_role
from schemas import RoleCreate, RoleResponse, RoleUpdate
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=RoleResponse)
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    return crud_role.create_role(db, role)


@router.get("/", response_model=list[RoleResponse])
def get_all_roles(db: Session = Depends(get_db)):
    return crud_role.get_all_roles(db)


@router.get("/{role_id}", response_model=RoleResponse)
def get_role_by_id(role_id: int, db: Session = Depends(get_db)):
    return crud_role.get_role_by_id(db, role_id)


@router.put("/{role_id}")
def update_role(role_id: int, role: RoleUpdate, db: Session = Depends(get_db)):
    return crud_role.update_role(db, role_id, role)


@router.delete("/{id}")
def delete_role(role_id: int, db: Session = Depends(get_db)):
    return crud_role.delete_role(db, role_id)
