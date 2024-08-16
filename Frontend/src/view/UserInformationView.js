import React from "react";
import '../styling/forms.css';
import {useFormik} from "formik";
/**
 * Renders the view the user information.
 * @param user user data.
 * @param handleSave 
 * @param showNext
 * @returns  div with user information.
 */
export default function UserInformationView({user, handleSave, showNext}) {
    async function storeUserData(values){
        try {
            const data = {...values, person_id: user.person_id}
            console.log("Values send from form: ", data);
            await handleSave(data);
            showNext();
        } catch (error) {
            console.error('Error updating user information:', error);
        }
    }
    const formik = useFormik({
        initialValues: {
            person_id: user.person_id,
            name: user.name,
            surname: user.surname,
            pnr: user.pnr,
            email: user.email,
        },
        onSubmit: async (values)=>{
            await storeUserData(values);
        },
        validate: values => {
            let errors = {}
            if(!values.name){errors.name = "Required"}
            if(!values.surname){errors.surname = "Required" }
            if(!values.pnr){errors.pnr = "Required"}
            if(!values.email){errors.email = "Required"}else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid email format";}
            return errors
        }
    })

    return (
        <div className={"mainContainer"}>
            <h2>Hello, {user.name}</h2>
            <p>This is the information you have entered. If something is not correct, please update.</p>
            <div className={"inputContainer"}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={"nameFields"}>
                        <div className="inputGroup">
                            <label htmlFor="name">Name:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}/>
                            {formik.errors.name ? <div className={"error-message"}>{formik.errors.name}</div> : null}
                        </div>
                        <div className="inputGroup">
                            <label htmlFor="surname">Surname:</label>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                value={formik.values.surname}
                                onChange={formik.handleChange}/>
                            {formik.errors.surname ?
                                <div className={"error-message"}>{formik.errors.surname}</div> : null}
                        </div>
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="pnr">Personal ID number:</label>
                        <input
                            type="text"
                            id="pnr"
                            name="pnr"
                            value={formik.values.pnr}
                            onChange={formik.handleChange}/>
                        {formik.errors.pnr ? <div className={"error-message"}>{formik.errors.pnr}</div> : null}
                    </div>
                    <div className="inputGroup">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formik.values.email}
                            onChange={formik.handleChange}/>
                        {formik.errors.email ? <div className={"error-message"}>{formik.errors.email}</div> : null}
                    </div>
                    <button type={"Submit"} className={"change"}>Change</button>
                </form>
            </div>
            <button onClick={showNext}>Go to the application</button>
        </div>
    )
}