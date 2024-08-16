import { useFormik } from "formik";
import React, { useState } from "react";

/**
 * AvailabilityView renders the user interface for inputting availability.
 * Renders the availability from the 'availability' table and saves the input data to the final step of the application.
 * The submit function validates the form, checks if the form is valid, finds the id for the particular availability chosen.
 *
 * @param props
 * @param handleAvailabilitySave the Availabilities to be saved.
 * @return availiability div view.
 */
export default function AvailabilityView({ props, handleAvailabilitySave }) {
    const [availabilityChoices, setAvailabilityChoices] = useState([]);
    //handleAvailabilitySave(values);

    const handleRemoveAvailability = (index) => {
        formik.resetForm();
        const updatedAvailabilityChoices = [...availabilityChoices];
        updatedAvailabilityChoices.splice(index, 1);
        setAvailabilityChoices(updatedAvailabilityChoices);
    };
    async function validateFormAndProceed(handleSave, availabilityChoices) {
        if (availabilityChoices.length !== 0) {
            handleSave(availabilityChoices);
        } else {
            console.log("Form has validation errors. Cannot proceed.");
        }
    }

    const formik = useFormik({
        initialValues: {
            from_date: [],
            to_date: [],
        },
        onSubmit: async (values) => {
            setAvailabilityChoices([...availabilityChoices, values]);
            formik.resetForm();
        },
        validate: values => {
            let errors = {}
            if (values.from_date.length === 0) { errors.from_date = "Required" }
            if (values.to_date.length === 0) { errors.to_date = "Required" }
            return errors;
        }
    })
    return (
        <div className={"mainContainer"}>
            <p>Please enter your availability period</p>
            <div className={"inputContainer"}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={"inputGroup"}>
                        <label htmlFor="from_date">Start date</label>
                        <input type={"date"}
                            name={"from_date"}
                            id={"from_date"}
                            placeholder={"Start date yy-mm-dd"}
                            onChange={formik.handleChange} />
                        {formik.errors.from_date ? <div className={"error-message"}>{formik.errors.from_date}</div> : null}
                    </div>
                    <div className={"inputGroup"}>
                        <label htmlFor="to_date">End date</label>
                        <input type={"date"}
                            name={"to_date"}
                            id={"to_date"}
                            placeholder={"End date yy-mm-dd"}
                            onChange={formik.handleChange} />
                        {formik.errors.to_date ? <div className={"error-message"}>{formik.errors.to_date}</div> : null}
                    </div>
                    <button type={"submit"}>Add</button>
                </form>
                <div className={"userDataContainer"}>
                    <h2>Your availabilities</h2>
                    <ul>
                        {/* Render all choices */}
                        {availabilityChoices.map((choice, index) => (
                            <li key={index}>
                                {choice.from_date} - {choice.to_date} <button className={"remove"} onClick={() => handleRemoveAvailability(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={() => validateFormAndProceed(handleAvailabilitySave, availabilityChoices)}>Next</button>
            </div>
        </div>
    )
}