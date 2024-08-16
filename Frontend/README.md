# IV1201 Recruitment App
Architecture &amp; design of web applications

## Project
In this project assignment, we are hired by a company to build a new, robust, scalable and well-documented web based recruitment application.
The aim is to have a functioning prototype of the system but the project also serves as an exercise in taking architectural decisions, understanding the design and structuring of applications and working together as a group towards a goal.

## Architecture overview
Our application follows a semi-monolithic architecture, combining client-side rendering with separate backend and frontend servers for enhanced modularity and scalability.
### Frontend
On the frontend, we use the JavaScript library React for building component-based user interfaces.
### Backend
The backend server can be found here: (https://github.com/blomquiste/IV1201-backend/tree/main)
### Database
PostgreSQL
### Deployment
The application is deployed with Heroku and can be found on this URL:
https://archdes-frontend-5528c891010d.herokuapp.com/

## Setup
* Install Node.js and PostgreSQL
* Create the database by running the existing-database.sql script in psql
* Clone this repository ```git clone ...```
* In your terminal, go to the cloned directory ```cd .../IV1201-frontend```
* Install all required packages with npm install.
* Start the server with ```npm run dev```
  Runs the app in the development mode.\
  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
  The page will reload when you make changes.\
  You may also see any lint errors in the console.

## File structure
```
IV1201-frontend
├── src
│   ├── components
│   │   └── NavigationBar.js
│   ├── integration
│   │   └── DBCaller.js
│   ├── presenter
│   │   ├── ApplicantPresenter.js
│   │   ├── LoginPresenter.js
│   │   ├── OverviewPresenter.js
│   │   ├── RegistrationPresenter.js
│   │   ├── MissingUserDataUpdatePresenter.js
│   │   └── UserPresenter.js
│   ├── styling
│   │   ├── App.css
│   │   ├── application.css
│   │   ├── forms.css
│   │   └── index.css
│   ├── view
│   │   ├── AccountUpdatedByEmailView.js
│   │   ├── AccountUpdateErrorView.js
│   │   ├── AvailabilityView.js
│   │   ├── CompetenceView.js
│   │   ├── ErrorURLView.js
│   │   ├── ErrorView.js
│   │   ├── FailedLoginView.js
│   │   ├── LoginView.js
│   │   ├── OverviweView.js
│   │   ├── RegistrationView.js
│   │   ├── RestoreAccountDataView
│   │   ├── SendRestoreUserdataEmailView
│   │   ├── SummaryView.js
│   │   ├── UserInformationView.js
│   │   └── UserView.js
│   ├── App.js - acts as the head controller
│   ├── App.test.js 
└── package.json
```
________________________________________
