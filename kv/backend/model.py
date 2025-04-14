from database import Base
from sqlalchemy import Column, String

#Creating Key-Value Storage Table For database (DATABASE MODEL)
class KeyValueStorage(Base):
    __tablename__ = 'key_value_storage'
    #setting up table attributes
    key = Column(String, primary_key= True, index= True)
    value= Column(String, index= True)
#Enabled index for both attributes to allow faster searching