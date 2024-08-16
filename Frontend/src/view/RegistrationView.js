import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import {useFormik} from 'formik'
import { useNavigate } from 'react-router-dom';
import '../styling/forms.css'

/**
 *
 * The RegistrationView component handles user registration by capturing user input,
 * validating the form fields and submitting them to the server which inserts into the database.
 * On successful registration the user is redirected to the login page.
 * @param onRegister A function to handle user registration.
 *                   It receives the form values as an argument and initiates the registration process.
 * @requires useState
 * @requires useEffect
 * @requires useFormik
 * @requires useNavigate
 * @requires Link
 */
function RegistrationView({onRegister=[]}) {
    const navigate = useNavigate();
    const [registered, setRegistered] = useState(false);

    useEffect(() => {
        if (registered) {
            const delayNavigation = setTimeout(() => {
                navigate('/');
            }, 3000);
            return () => clearTimeout(delayNavigation); // Cleanup function to clear the timeout if component unmounts
        }
    }, [registered, navigate]);

    const formik = useFormik({
        // Manage form state
        initialValues: {
            firstname: '',
            lastname: '',
            pid: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        },
        // Submit form data
        onSubmit: async (values) => {
            try {
                await onRegister(values);
                setRegistered(true);
            } catch (error) {
                // Handle error during registration
                console.error('Error registering user:', error);
            }
        },
        // Validate form fields
        validate: values => {
            let errors = {}
            if(!values.firstname){errors.firstname = "Required"}
            if(!values.lastname){errors.lastname = "Required" }
            if(!values.pid){errors.pid = "Required"}
            if(!values.email){errors.email = "Required"}else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid email format";}
            if(!values.username){errors.username = "Required"}
            if(!values.password){errors.password = "Required"}
            if(!values.confirmPassword){errors.confirmPassword = "Required"}else if(values.confirmPassword !== values.password){
                errors.confirmPassword = "Must be the same as password"}
            return errors
        }
    })
    return(
        <div className={"mainContainer"}>
            <h1>Register here</h1>
            {registered && <h3 className={"success-message"}>You have successfully registered an account!</h3>}
            <div className={"inputContainer"}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={"nameFields"}>
                        <div className={"inputGroup"}>
                            <label htmlFor={"firstname"}>First name</label>
                            <input type={"text"} id={"firstname"} name={"firstname"} onChange={formik.handleChange} value={formik.values.firstname}/>
                            {formik.errors.firstname ? <div className={"error-message"}>{formik.errors.firstname}</div> : null}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor={"lastname"}>Last name</label>
                            <input type={"text"} id={"lastname"} name={"lastname"} onChange={formik.handleChange} value={formik.values.lastname}/>
                            {formik.errors.lastname ? <div className={"error-message"}>{formik.errors.lastname}</div> : null}
                        </div>
                    </div>
                    <div className="inputGroup">
                        <label htmlFor={"pid"}>Personal Identification number</label>
                        <input type={"number"} id={"pid"} name={"pid"} onChange={formik.handleChange} value={formik.values.pid}/>
                        {formik.errors.pid ? <div className={"error-message"}>{formik.errors.pid}</div> : null}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor={"email"}>Email</label>
                        <input type={"email"} id={"email"} name={"email"} onChange={formik.handleChange}
                               value={formik.values.email}/>
                        {formik.errors.email ?  <div className={"error-message"}>{formik.errors.email}</div> : null}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor={"username"}>Username</label>
                        <input type={"text"} id={"username"} name={"username"}
                               onChange={formik.handleChange}
                               value={formik.values.username}/>
                        {formik.errors.username ? <div className={"error-message"}>{formik.errors.username}</div> : null}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor={"password"}>Password</label>
                        <input type={"password"} id={"password"} name={"password"}
                               onChange={formik.handleChange}
                               value={formik.values.password}/>
                        {formik.errors.password ? <div className={"error-message"}>{formik.errors.password}</div> : null}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor={"password"}>Confirm password</label>
                        <input type={"password"} id={"confirmPassword"} name={"confirmPassword"}
                               onChange={formik.handleChange} value={formik.values.confirmPassword}/>
                        {formik.errors.confirmPassword ?  <div className={"error-message"}>{formik.errors.confirmPassword}</div> : null}
                    </div>
                <button type={"submit"}>Register</button>
                </form>
            </div>
            <p>Already have an account? <Link to={"/"}>Sign in</Link></p>
        </div>
    )
}

export default RegistrationView;