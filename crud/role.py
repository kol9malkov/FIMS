from sqlalchemy.orm import Session
from models import Role
from schemas import RoleCreate, RoleUpdate


def create_role(db: Session, role: RoleCreate) -> Role:
    db_role = Role(**role.model_dump())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role


def get_role_by_id(db: Session, role_id: int) -> Role | None:
    db_role = db.query(Role).filter(Role.role_id == role_id).first()
    return db_role


def get_role_by_name(db: Session, role_name: str) -> Role | None:
    db_role = db.query(Role).filter(Role.role_name == role_name).first()
    return db_role


def get_all_roles(db: Session) -> list[Role]:
    return db.query(Role).all()


def update_role(db: Session, role_id: int, role_data: RoleUpdate) -> Role | None:
    db_role = get_role_by_id(db, role_id)
    if not db_role:
        return None
    for key, value in role_data.model_dump(exclude_unset=True).items():
        setattr(db_role, key, value)
    db.commit()
    db.refresh(db_role)
    return db_role


def delete_role(db: Session, role_id: int) -> bool:
    role = get_role_by_id(db, role_id)
    if not role:
        return False
    db.delete(role)
    db.commit()
    return True
