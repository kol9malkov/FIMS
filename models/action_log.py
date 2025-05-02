from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DATETIME
from sqlalchemy.orm import relationship
from database import Base

class ActionLog(Base):
    __tablename__ = 'action_logs'

    action_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.user_id'))
    action_type = Column(String, nullable=False)
    action_date = Column(DATETIME, default=datetime.now)
    details = Column(String)

    # связи
    user = relationship("User", back_populates="action_logs")