import React, { useState } from 'react';
import '../styling/forms.css'
import {Link, useNavigate} from 'react-router-dom';

/**
 * The LoginView contains the sign-in form and functionality
 * @param props.onLogin takes username and password and passes it to the login API in the backend
 *
 */
function LoginView(props) {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    let username = "";
    let password= "";
    const [error, setError] = useState('');
    function usernameHandlerACB(e){username=e.target.value; }
    function passwordHandlerACB(e){password=e.target.value}

    async function loginACB() {
        const result = await props.onLogin({
            username: username,
            password: password
        });/*
        if (result===true){
            setLoggedIn(true);
        }else{
            navigate("/error")
        }*/
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
    };

    return (
        <div className={"mainContainer"}>
            <h1>Welcome!</h1>
            <p>Please sign in before submitting an application</p>
            <form onSubmit={handleSubmit}>
                <div className={"inputGroup"}>
                    <input type="username"
                           placeholder="Username"
                           onChange={usernameHandlerACB}
                           className={"inputBox"}/>
                </div>
                <div className={"inputGroup"}>
                    <input onChange={passwordHandlerACB}
                           type={"password"}
                           placeholder="Password"
                           className={"inputBox"}/>
                </div>
                {error && <div className={"error-message"}>{error}</div>}
                <button type="submit" onClick={loginACB}>Log in</button>
            </form>
            <p>Not registered? <Link to={"/register"}>Sign up here</Link></p>
            <p>Add username and password to an existing account? <Link to={"/updateUser"}>Click here</Link></p>
        </div>
    )
}

export default LoginView;