from pydantic import BaseModel

#To auto validate incoming data and to send response data to user
class KeyValueItem(BaseModel):
    key: str
    value: str

class MessageResponse(BaseModel):
    message: str

#Response Model For GetApi for specific key
class KeyValueResponse(BaseModel):
    value:str
    message:str