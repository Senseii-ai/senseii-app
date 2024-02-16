from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

PyObjectID = Annotated(str, BeforeValidator(str))


class UserModel(BaseModel):
    """
    A User document
    """

    id: PyObjectID | None = Field(alias="_id", default=None)
    name: str = ...
    email: EmailStr = ...
    threads: list[str]
    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        populate_by_name=True,
        json_schema_extra={
            "example:" {
                "name": "John Doe",
                "email": "johndoe@example.com",
                
            }
        }
    )