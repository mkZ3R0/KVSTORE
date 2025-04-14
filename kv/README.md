# dev-mukeeskhan-kvstore

## Backing Store
Used SQLITE Relational Database

# DESIGN

## Backend:
For the backend, I plan to use sqlite by making use of sqlalchemy library. The database will be fairly simple consisting of 2 string columns, the key and the value, where the key will act as the primary key. For data validation for the database I will be using pydantic library to create response models, consisting of a KeyItem to return a list, a simply message model to return a string to indicate if the operation was successful or not, and a special Value and message model for GET method to return the value of a provided key along with a message.

![KEYVALUESTORE DESIGN](https://github.com/user-attachments/assets/2b61aada-e0bb-4799-873e-ca3312324b44)

## Frontend:
For the frontend, I plan to use one complex object consisting of key and value using a mutable state. I will have 4 individual buttons, one for each CRUD operation, with each having their separate handlers, which will have a single dispatch function with different types of actions. I will have a list and item component as well to accommodate the listing operation. I also plan to have 4 booleans within the complex object for each state to allow for conditional rendering to show the retrieved results based on the previously executed operations. The intention behind having all states in one complex object, handled by a single reducer function is to prevent impossible states. For the styling, I plan to go with the default styling provided by the vite configuration.

