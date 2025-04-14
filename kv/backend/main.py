from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Annotated,List
from database import SessionLocal, engine
from pydanticModel import KeyValueItem, MessageResponse, KeyValueResponse
import model
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

#Enabling cors to allow other applications to call api
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], #Allowing all origins to access
    allow_credentials=True,
    allow_methods=["GET", "PUT", "DELETE"],
    allow_headers=["*"],
)

#database dependency, to , always close database connection at end
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close
#creating dependency injection, to inject database session to CRUD operation functions
db_dependency = Annotated[Session, Depends(get_db)]

#Creating database and tables on creation of api
model.Base.metadata.create_all(bind=engine)

#Create API
@app.put("/createItem/", response_model=MessageResponse)
async def createKeyValuePair(keyValuePair: KeyValueItem, db:db_dependency):
    try:
        if(db.query(model.KeyValueStorage).filter(model.KeyValueStorage.key == keyValuePair.key).first()):
            return MessageResponse(message = "A key value pair already exists for the Key: "+ keyValuePair.key +" , If you wish to update it kindly use the update operation")
        
        db_item = model.KeyValueStorage(**keyValuePair.dict())#map attributes from pydantic model to table
        db.add(db_item)
        db.commit()
        return MessageResponse(message = "Key value pair added successfully")
    
    except:
        raise HTTPException(
            status_code = 500, detail= "Failed to add key value pair due to internal server error"
        )
    
#GET API
@app.get("/getItem/", response_model=KeyValueResponse)
async def getKeyValuePair(key: str, db:db_dependency):
    try:
        db_item = db.query(model.KeyValueStorage).filter(model.KeyValueStorage.key == key).first()
        if db_item is None:
            return KeyValueResponse(value = "", message = "No associated value found for Key: "+key)
        
        return KeyValueResponse(value = db_item.value, message = "Value associated with Key: " + key +" is "+ db_item.value)
    except:
        raise HTTPException(
            status_code = 500, detail= "Failed to get associated value of key due to internal server error"
        )

#LIST API
@app.get("/list/", response_model=List[KeyValueItem])
async def listAllKeyValuePairs(db:db_dependency):
    try:
        allPairs = db.query(model.KeyValueStorage).all()
        return allPairs
    
    except:
            raise HTTPException(
            status_code = 500, detail= "Failed to fetch all key value pairs due to internal server error"
        )

#DELETE API
@app.delete("/deleteItem/", response_model=MessageResponse)
async def deleteKeyValuePair(key: str, db:db_dependency):
    try:
        db_item = db.query(model.KeyValueStorage).filter(model.KeyValueStorage.key == key).first()
        if db_item is None:
            return MessageResponse(message = "No such key value pair exists for Key: "+key)
        
        db.delete(db_item)
        db.commit()
        return MessageResponse(message = "Key value pair deleted successfully for Key: "+key)
    except:
            raise HTTPException(
            status_code = 500, detail= "Failed to delete key value pair due to internal server error")


#UPDATE API
@app.put("/updateItem/", response_model=MessageResponse)
async def updateKeyValuePair(newKeyValuePair: KeyValueItem, db:db_dependency):
    try:
        db_item= db.query(model.KeyValueStorage).filter(model.KeyValueStorage.key == newKeyValuePair.key).first()
        
        if db_item is not None:
            db_item.value = newKeyValuePair.value
            db.commit()
            return MessageResponse(message = "Value of key: "+ newKeyValuePair.key + " updated successfully")
        
        return MessageResponse(message = "No such key value pair exists for the Key: "+ newKeyValuePair.key)
    
    except:
        raise HTTPException(
            status_code = 500, detail= "Failed to update key value pair due to internal server error"
        )

