'use strict';

/**
 * Starts the server process that receives all HTTP requests and passes them on to relevant handler component.
 * All url routes to be accessed must be registered here with app.use(<url>)
 * Sets up BodyParser, CookieParser and handles CORS permissions.
 *
 * Handle HTTP responses - is this part needed??
 * @type {{json: Function, raw: Function, text: Function, urlencoded: Function}|{json?: *, raw?: *, text?: *, urlencoded?: *}}
 */

const SERVER_PORT = 8000;
const path = require('path');
const APP_ROOT_DIR = path.join(__dirname, '..');

require('dotenv-safe').config({
    path: path.join(APP_ROOT_DIR, '.env'),
    example: path.join(APP_ROOT_DIR, '.env-example'),
});
 
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());


/**
 * CORS configuration to only allow requests from frontend and localhost.
 */
app.use((req, res, next) => {
    const allowedOrigins=["https://archdes-frontend-5528c891010d.herokuapp.com", "http://localhost:3000"]
    let origin = "";
    console.log(origin)
    if(allowedOrigins.indexOf(req.get('origin')) === 0) {
        origin = "https://archdes-frontend-5528c891010d.herokuapp.com";
    } else if (allowedOrigins.indexOf(req.get('origin')) === 1){
        origin = "http://localhost:3000";
    } else {
      console.log("Origin denied by CORS");
      res.status(500).end(); //should probably be 403 access denied but the frontend only handles 500 codes atm
      return;
    }
    console.log(origin)
    res.header("Access-Control-Allow-Origin", origin);

 
    //res.header("Access-Control-Allow-Origin", "https://archdes-frontend-5528c891010d.herokuapp.com")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authcookie");
  res.header("Access-Control-Allow-Credentials", "true");

    // Check if it's a preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        // Respond with 200 and appropriate headers
        res.status(200).end();
        return;
    }

    // Pass the request to the next middleware
    next();
});


/**
 * Handles requests to /.
 * @returns {HTTPResponse} with a dummy message. 
 */
app.get('/', (req, res) => {
  return res.send('hello from group 16');
});

const loginRoute = require('./api/login')
app.use(loginRoute);

const logoutRoute = require('./api/logout')
app.use(logoutRoute);

const registerRoute = require('./api/registration')
app.use(registerRoute);

const restoreAccountRoute = require('./api/sendRestoreMail')
app.use(restoreAccountRoute);

const UpdateAccountByEmailCodeRoute = require('./api/UpdateAccountByEmailCode');
app.use(UpdateAccountByEmailCodeRoute);

const fetchRoute = require('./api/fetch')
app.use(fetchRoute);

const updateRoute = require('./api/update')
app.use(updateRoute);

const competenceRoute = require('./api/setCompetence')
app.use(competenceRoute);

const availabilityRoute = require('./api/setAvailability')
app.use(availabilityRoute);

const getCompetenceRoute = require('./api/getCompetences')
app.use(getCompetenceRoute);

const getAvailabilityRoute = require('./api/getAvailabilities')
app.use(getAvailabilityRoute);

const fetchApplicantsRoute = require('./api/fetchApplicants')
app.use(fetchApplicantsRoute);


const errorHandler = require('./api/ErrorHandler')
app.use(errorHandler);

const server = app.listen(
  //process.env.SERVER_PORT,
  process.env.PORT?process.env.PORT:SERVER_PORT,
  process.env.SERVER_HOST,
  () => {
    console.log(`Server started at ${server.address().address}:${server.address().port}`,);
  },
);

module.exports = server;