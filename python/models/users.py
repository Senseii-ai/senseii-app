from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing_extensions import Annotated
from pydantic.functional_validators import BeforeValidator

PyObjectID = Annotated(str, BeforeValidator(str))


class UserModel(BaseModel):
    """
    A User document
    """

    id: PyObjectID | None = Field(alias="_id", default=None)
    name: str = Field(...)
    email: Email
