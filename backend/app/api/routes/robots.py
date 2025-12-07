from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional, List
from uuid import UUID
from app.database import get_db
from app.core.security import get_current_user, require_role
from app.models.user import User
from app.models.robot import Robot
from app.schemas.robot import (
    RobotCreate,
    RobotUpdate,
    RobotResponse,
    RobotListResponse
)

router = APIRouter(prefix="/robots", tags=["Robots"])


@router.get("", response_model=RobotListResponse)
async def list_robots(
    category: Optional[str] = None,
    status: Optional[str] = Query("active", regex="^(active|inactive|maintenance)$"),
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List available robots"""
    query = select(Robot).where(Robot.status == status)

    # Filter by category if provided
    if category:
        query = query.where(Robot.services.contains([category]))

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar()

    # Get robots with pagination
    query = query.offset(skip).limit(limit).order_by(Robot.created_at.desc())
    result = await db.execute(query)
    robots = result.scalars().all()

    return {
        "robots": robots,
        "total": total
    }


@router.get("/{robot_id}", response_model=RobotResponse)
async def get_robot(
    robot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get robot details"""
    result = await db.execute(select(Robot).where(Robot.id == robot_id))
    robot = result.scalar_one_or_none()

    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    return robot


@router.post("", response_model=RobotResponse, status_code=201)
async def create_robot(
    robot_data: RobotCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("robot_owner", "admin"))
):
    """Create a new robot (robot_owner or admin only)"""
    # Validate price
    if robot_data.price <= 0:
        raise HTTPException(status_code=400, detail="Price must be greater than 0")

    # Create robot
    new_robot = Robot(
        owner_id=current_user.id,
        name=robot_data.name,
        description=robot_data.description,
        price=robot_data.price,
        currency=robot_data.currency,
        wallet_address=robot_data.wallet_address,
        services=robot_data.services,
        endpoint=robot_data.endpoint,
        status="active"
    )

    db.add(new_robot)
    await db.commit()
    await db.refresh(new_robot)

    return new_robot


@router.patch("/{robot_id}", response_model=RobotResponse)
async def update_robot(
    robot_id: UUID,
    robot_data: RobotUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update robot (owner or admin only)"""
    # Get robot
    result = await db.execute(select(Robot).where(Robot.id == robot_id))
    robot = result.scalar_one_or_none()

    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    # Check ownership or admin
    if robot.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to update this robot")

    # Update fields
    update_data = robot_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(robot, field, value)

    await db.commit()
    await db.refresh(robot)

    return robot


@router.delete("/{robot_id}", status_code=204)
async def delete_robot(
    robot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(require_role("admin"))
):
    """Delete robot (admin only)"""
    result = await db.execute(select(Robot).where(Robot.id == robot_id))
    robot = result.scalar_one_or_none()

    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    await db.delete(robot)
    await db.commit()

    return None


@router.get("/{robot_id}/metrics")
async def get_robot_metrics(
    robot_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get robot metrics"""
    result = await db.execute(select(Robot).where(Robot.id == robot_id))
    robot = result.scalar_one_or_none()

    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    return {
        "robot_id": robot.id,
        "name": robot.name,
        "total_executions": robot.execution_count,
        "total_revenue": float(robot.total_revenue),
        "avg_response_time": robot.avg_response_time,
        "success_rate": robot.success_rate,
        "price": float(robot.price),
        "status": robot.status
    }
