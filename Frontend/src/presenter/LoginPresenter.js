import React from "react";
import { useNavigate } from 'react-router-dom';
import LoginView from "../view/LoginView";
import FailedLoginView from "../view/FailedLoginView"

/**
 * Handles logic for login-related views
 * @param props
 * @param {boolean} props.loggedIn - true if user is logged in
 * @param {boolean} props.failedLogin - true if the user has tried to log in and failed
 * @param {function} props.handleLogin - login function that calls the backend api to login user
 * @returns LoginView - view that shows the login page
 * FailedLoginView - shows the LoginView with added error message about failed login
 * UserView - landing page after successful login
 */
export default function Login(props) {
    const navigate = useNavigate();

    return (<>
            <div>{!props.loggedIn && !props.failedLogin && <LoginView onLogin={props.handleLogin}/>}</div>
            <div>{props.loggedIn && !props.recruiter && navigate("/user")}</div>
            <div>{props.loggedIn && props.recruiter && navigate("/overview")}</div>
            <div>{props.failedLogin && <FailedLoginView onLogin={props.handleLogin}/>}</div>
        </>
    )
}