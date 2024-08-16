## A Recruitment Application
This project assignment simulates a scenario where we are hired to build a
web based recruitment application for the recruiting of an amusement park. The system
must implement certain features, be scalable and well-documented in order to hand it
over to new developers in the future. The primary goal is to have a functioning prototype
of the system and application which consists of a front-to-back system with a user inter-
face where an applicant can submit information that is placed in an external database.
The project also serves as an exercise in architectural decision-making, deepening our
understanding of application design and structuring effective teamwork

## Project Structure and Design:
In this application, we have implemented a separation of concerns by hosting the frontend and backend on different servers. This architectural choice enhances scalability and allows each component to be optimized and managed independently.

### Frontend:
The frontend, housed in the frontend directory, is built using React.
### Backend:
The backend, located in the backend directory, is developed using Express, a web framework for Node.js. Express provides a features to handle HTTP requests, connect to databases and implement business logic.

### Database and hosting
We used Heroku for hosting and the database is managed using Heroku Postgres, a cloud-based SQL database service provided by Heroku. The backend server connects to this Postgres database using a connection string provided by Heroku. This connection string includes all necessary details, such as the database name, host, port, username, and password, enabling secure and efficient communication between the application and the database.
