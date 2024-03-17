from pydantic import BaseModel

class Goal(BaseModel):
    id: int
    name: str
    description: str
    start_date: str | None
    end_date: str | None
    status: str
    progress: int # this is going to be percentage, I need to better define it actually.
    is_validated: bool
    plan: str | None

class UserGoals(BaseModel):
    user_name: str
    goals: list[Goal]
