# IV1201 Recruitment App
Architecture &amp; design of web applications

## Project
In this project assignment, we are hired by a company to build a new, robust, scalable and well-documented web based recruitment application.
The aim is to have a functioning prototype of the system but the project also serves as an exercise in taking architectural decisions, understanding the design and structuring of applications and working together as a group towards a goal.

## Architecture overview
Our application follows a semi-monolithic architecture, combining client-side rendering with separate backend and frontend servers for enhanced modularity and scalability.
### Frontend
Frontend repository is found here: https://github.com/blomquiste/IV1201-frontend
### Backend
The backend is powered by Node.js and Express, handling server-side logic, data processing, and API endpoints.
### Database
PostgreSQL
### Deployment
The application is deployed with Heroku and can be found on this URL: https://archdes-frontend-5528c891010d.herokuapp.com/

## Setup
* Install Node.js, Express and PostgreSQL
* Create the database by running the existing-database.sql script in psql
* Clone this repository ```git clone ...```
* In you terminal, go to the cloned directory ```cd .../IV1201-backend```
* Install all required packages with npm install.
* Start the server with ```npm run dev```

## File structure
```
IV1201-backend
├── src
│   ├── api
│   │   ├── Authorization.js
│   │   ├── ErrorHandler.js
│   │   ├── fetch.js
│   │   ├── getCompetences.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── registration.js
│   │   ├── setCompetence.js
│   │   ├── setAvailability.js
│   │   ├── sendRestoreMail.js
│   │   ├── update.js
│   │   └── UpdateAccountByEmailCode.js
│   ├── controller
│   │   └── Controller.js
│   ├── integration
│   │   ├── DAO.js
│   │   └── Email.js
│   ├── model
│   │   ├── Application.js
│   │   └── User.js
│   ├── util
│   │   └── Validate.js
│   └── server.js
└── package.json
```

________________________________________
