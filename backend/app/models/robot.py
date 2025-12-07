from sqlalchemy import Column, String, Numeric, Integer, Float, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from datetime import datetime
import uuid
from app.database import Base


class Robot(Base):
    __tablename__ = "robots"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(20, 6), nullable=False)
    currency = Column(String(10), default="USDC")
    wallet_address = Column(String(255), nullable=False)
    services = Column(JSONB, nullable=False)  # List of service types
    endpoint = Column(String(500), nullable=False)  # Where the robot service runs
    status = Column(String(50), default="active")  # active | inactive | maintenance
    execution_count = Column(Integer, default=0)
    total_revenue = Column(Numeric(20, 6), default=0)
    avg_response_time = Column(Float, default=0.0)
    success_rate = Column(Float, default=1.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Robot {self.name} (${self.price})>"
