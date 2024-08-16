import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate} from "react-router-dom";
import './styling/App.css';
import Login from "./presenter/LoginPresenter"
import Registration from "./presenter/RegistrationPresenter";
import MissingUserDataUpdate from "./presenter/UpdateMissingUserDataPresenter";
import Applicant from "./presenter/ApplicantPresenter"
import User from "./presenter/UserPresenter"
import Error from "./view/ErrorView";
import UnauthorizedView from "./view/UnauthorizedView";
import ErrorURL from "./view/ErrorURLView";
import NavigationBar from "./components/NavigationBar";
import Overview from "./presenter/OverviewPresenter";
import {
    Authenticate,
    saveRegistrationData,
    restoreAccountByEmail,
    logout,
} from './integration/DBCaller'

/** Express-based auth server that uses JWT tokens to authenticate users
 * npm i cors bcrypt jsonwebtoken lowdb
 * 
 * Renders all the site presenters and ErrorView
 * Saves loggedIn state in sessionStorage for persistance;
 * When the application refreshes, check if the user information exists in sessionStorage
 * 
 @returns LoginPresenter - handles logic for login and calls the relevant views
 * RegistrationPresenter - handles logic for registration and calls the relevant views.
 * ErrorView - shows simple error message on server error during api calls.
 */
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userObject, setUserObject] = useState({});
    const [failedLogin, setFailedLogin] = useState(false);
    const [recruiter, setRecruiter] = useState(false);

    const [error, setError] = useState(false);
    const [registered, setRegistered] = useState(false);
    //const navigate = useNavigate();
    useEffect(() => {
    // Check sessionStorage on page load
    const user = sessionStorage.getItem('user');
    if (user) {
        setLoggedIn(true);
        setUserObject(JSON.parse(user));
        }
    }, []);

  /**
   * Function that calls the backend api and sets the result as the user state 
   * and sets loggedIn boolean state to true in LoginPresenter on a successful api call.
   * Also handles errors in failed api calls.
   * @async
   * @param {Object} user takes argument on the form of: {username: 'username', password:'pw'}
   * 
   */
  async function handleLogin(user){
    let response; 
    try{
      response = await Authenticate(user);
      if(response === 404)
        setFailedLogin(true)
      else if(response === 500){
        console.log("hello")
        throw new Error("500 http code from server")
      }
      else{
        setFailedLogin(false)
        setUserObject(response)
        setLoggedIn(true)
        response.role_id===1?setRecruiter(true):setRecruiter(false) //TODO
        sessionStorage.setItem('user', JSON.stringify(response));
      }
    }catch(e){
      console.error(`error in callDB: ${e}`)
      setError(true)
      //navigate('/error');
      //window.location.href='/error';
    }
  }
    /**
     * Function that calls the backend api,
     * sets 'registered' boolean state to true on a successful api call.
     * @param fieldValues The values provided by the user trying to register as an object
     */
    async function handleRegistration(fieldValues) {
        try {
            const response = await saveRegistrationData(fieldValues);
            if (response) {
                setRegistered(true);
            } else {
                console.error('Registration failed:', response.statusText);
                setRegistered(false);
            }
        } catch (error) {
            console.error('Error registering user:', error);
            setRegistered(false);
        }
    }
    /**
     *
     * @param email
     * @returns {Promise<void>}
     */
  async function updateUserData(email){
    console.log("jsoning email", JSON.stringify(email))
    restoreAccountByEmail(email)
  }

  return (<div className={"App"}>
        <Router>
            {loggedIn && <NavigationBar/>}
            <Routes>
                <Route path="/" element={!error? <Login
                       handleLogin = {handleLogin}
                       failedLogin = {failedLogin}
                       user = {userObject}
                       loggedIn={loggedIn}
                       recruiter={recruiter}/>:<Error/>}/>
                <Route path="/register" element={!error && <Registration
                       handleRegistration={handleRegistration}
                       registered={registered}/>}/>
                <Route path="/updateUser" element = {!error && <MissingUserDataUpdate 
                       updateUserData = {updateUserData}/>}/>
                <Route path="/user" element={loggedIn && !recruiter ? <User
                       user = {userObject} /> : <Error/>} />
                <Route path="/apply" element={loggedIn ? <Applicant
                       user = {userObject} /> : <Error/>} />
                <Route path="/overview" element={loggedIn && recruiter ? <Overview/> : <UnauthorizedView/>}/>
                <Route path="/" element={error && <Error/>}  />
                <Route path="/error" element={ <ErrorURL />} />
            </Routes>
        </Router>
      
    </div>)
}
export default App;