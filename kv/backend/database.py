from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


#Setting Up Database
#database type and path
DATABASE_URL = 'sqlite:///./keyValueStorage.db'
#SQLALCHEMY engine allows to initialize and manage connections to database
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
#Creating a session object to interact with the database through SQLAlchemy's ORM
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#Defining a base class that is used to make define mapped classes/tables in our database
Base = declarative_base()