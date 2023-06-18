# Food_Free-Backend
# The Main Idea from Project:
### The main idea of the project:
The idea of the project is a search for the barcode number, and the result of the search shows us whether this product causes allergies or not
For example, a person with gluten sensitivity and wanted to search for whether this bread is gluten-free, so he writes the barcode of the product and displays a result of whether it is free or not.


# This is a brief description of My project.

To get started, you will need to install the following dependencies:
### express - Mongoose - JWT - session - bcrypt - dotenv...

### npm Nodemon app.js

The server will start on port 8000. You can access the application at http://localhost:8000.


## Connecting the DB with Express Code.
<code>
 mongoose.connect(process.env.DB_URL).then(() => { 
  //If the connection finished print the result on console
  console.log("=======connection succeeded========");
}) 
.catch((error) => {  
  //if there is any error will be show for you.
  console.log("=======connection not succeeded========");
  console.log(error.message);
});   
 
 </code>
 
 

# Admin Side:
## - the Admin  able to add a new Food.
## - the Admin  able to edit the Food.
## - the Admin  able to list all the Food he/she created.
## - the Admin  able to delete any of the Food he created.
## -There are no one can dalete or update for other only them self they can.
### The the relation on database between the Foods and Admin can add one both side and and update.

# User Side (API):
## On both side connected Many to many they delete and update the Food Free.
## The user can Add any of the Food Allegray. 
## The user can list all the courses he is registered in.
## The user can cancel the registration from the course.
## The the relation on database between the user and food allegary can add one both side and delete also and update.
## The User can Request from Admin to Add Prodects on System.

# Community Side
## The Community side the user he/she can Add Comments update on it and Delete the comment also Display his/her comments and All the other comments.

### There are Four Model Database Admin, Community Food Free for the prodect have Allegery food and The user.
## Routers
### There are Four Routers Admin, Community Food Free for the prodect have Allegery food and The user.

### The WebSite have checkLoggedInUser and checkLoggedInAdmin to check and make sure for each one Access. 

### For DataBase and JWS on .env file





