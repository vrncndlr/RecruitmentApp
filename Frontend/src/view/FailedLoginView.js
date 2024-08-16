import React, { useState } from 'react';
import '../styling/forms.css'
import {Link} from 'react-router-dom';

/**
 * Is called when a login attempt has failed. Shows extra error message compared to regular login view.
 * @param {function} onLogin takes username and password and passes it to the login API in the backend
 * @returns forms for entering username and password
 */
function FailedLoginView(props){
    let username ="";
    let password="";
    const [error, setError] = useState('');
    function usernameHandlerACB(e){username=e.target.value; }
    function passwordHandlerACB(e){password=e.target.value}
//console.log(username)
    function loginACB(){
        props.onLogin({
            username: username,
            password: password
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        // Your sign-in logic here
    };

    return (
        <div className={"mainContainer"}>
            <h1>Welcome!</h1>
            <p>Please sign in before submitting an application</p>
            <p className={"error-message"}>Bad username or password</p>
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
                           className={"inputBox"}/> {/*TODO hide pass*/}
                </div>
                {error && <div style={{color: 'red'}}>{error}</div>}
                <button type="submit" onClick={loginACB}>Log in</button>
            </form>
            <p>Not registered? <Link to={"/register"}>Sign up here</Link></p>
            <p>Add username and password to an existing account? <Link to={"/updateUser"}>Click here</Link></p>
        </div>
    )
}

export default FailedLoginView;