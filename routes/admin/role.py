from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud.role as crud_role
from dependencies.dependence import admin_required
from schemas import RoleCreate, RoleResponse, RoleBase
from utils import get_db

router = APIRouter()


@router.post("/create", response_model=RoleResponse, dependencies=[Depends(admin_required)])
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    if crud_role.get_role_by_name(db, role.role_name):
        raise HTTPException(status_code=409, detail="Роль уже существует")
    db_role = crud_role.create_role(db, role)
    return db_role


@router.get("/", response_model=list[RoleResponse], dependencies=[Depends(admin_required)])
def get_all_roles(skip: int = 0, limit: int = 15, search: str = '', db: Session = Depends(get_db)):
    return crud_role.get_all_roles(db, skip=skip, limit=limit, search=search)


@router.get("/{role_id}", response_model=RoleResponse, dependencies=[Depends(admin_required)])
def get_role_by_id(role_id: int, db: Session = Depends(get_db)):
    return crud_role.get_role_by_id(db, role_id)


@router.put("/{role_id}", response_model=RoleResponse, dependencies=[Depends(admin_required)])
def update_role(role_id: int, role: RoleBase, db: Session = Depends(get_db)):
    db_role = crud_role.get_role_by_id(db, role_id)
    if not db_role:
        raise HTTPException(status_code=404, detail="Роль не найдена")
    existing = crud_role.get_role_by_name(db, role.role_name)
    if existing and existing.role_id != role_id:
        raise HTTPException(status_code=409, detail="Роль с таким именем уже существует")

    return crud_role.update_role(db, db_role, role)


@router.delete("/{role_id}", status_code=204, dependencies=[Depends(admin_required)])
def delete_role(role_id: int, db: Session = Depends(get_db)):
    if not crud_role.delete_role(db, role_id):
        raise HTTPException(status_code=404, detail="Роль не найдена")
