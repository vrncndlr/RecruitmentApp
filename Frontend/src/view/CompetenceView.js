import React, { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import {useFormik, Field} from 'formik'
import '../styling/forms.css'
import '../styling/application.css'

/**
 * CompetenceView renders the user interface for inputting expertise and experience.
 * Renders the competences from the 'competence' table and saves the input data to the final step of the application.
 * The submit function validates the form, checks if the form is valid, finds the id for the particular competence chosen,
 * checks if the competence is already selected by the user and if not appends the chosen competences to the form values selected.
 *
 * @param competences The values retrieved from the database
 * @param handleCompetenceSave function to persist the form data upon route change
 * @returns {Element}
 */
export default function CompetenceView({ competences, handleCompetenceSave }) {
    const [competenceChoices, setCompetenceChoices] = useState([]);

    const handleRemoveCompetence = (index) => {
        formik.resetForm();
        const updatedCompetenceChoices = [...competenceChoices];
        updatedCompetenceChoices.splice(index, 1);
        setCompetenceChoices(updatedCompetenceChoices);
    };

    async function validateFormAndProceed(handleSave, competenceChoices) {
        if (competenceChoices.length!==0) {
            handleSave(competenceChoices);
        } else {
            console.log("Form has validation errors. Cannot proceed.");
        }
    }

    const formik = useFormik({
        initialValues: {
            competence_id: null,
            expertise: [],
            monthsOfExperience: [],
        },
        onSubmit: async (values) => {
            const err = await formik.validateForm();
            if (Object.keys(err).length === 0) {
                const selectedCompetence = competences.find(competence => competence.name === values.expertise);
                const exists = competenceChoices.some(choice => choice.expertise === values.expertise);
                if (!exists) {
                    setCompetenceChoices([...competenceChoices,
                        {   competence_id: selectedCompetence.competence_id,
                            expertise: values.expertise,
                            monthsOfExperience: values.monthsOfExperience }]);
                    await formik.resetForm();
                } else {
                    console.log("This competence already exists in the list.");
                }
            } else {
                console.log("Form has validation errors. Cannot submit.");
            }
        },
        validate: values => {
            let errors = {}
            if (values.expertise.length === 0) {
                errors.expertise = "Required"
            }
            if (values.monthsOfExperience.length === 0) {
                errors.monthsOfExperience = "Required"
            }
            return errors
        }
    })

    return (<div className={"mainContainer"}>
            <h2>Please enter your field of expertise and your experience in the field.</h2>
            <div className={"inputContainer"}>
                <form onSubmit={formik.handleSubmit}>
                    <div className={"inputGroup"}>
                        <label htmlFor={"expertise"}>Area of expertise</label>
                        <select
                            id={"expertise"}
                            name={"expertise"}
                            onChange={formik.handleChange}>
                            <option value={formik.values.expertise || ''} label="Select area of expertise"></option>
                            {!competences ? (
                                <option disabled>Loading competences...</option>) : (
                                <>
                                    {/* Render options from the competences state */}
                                    {competences.map((competence) => (
                                        <option key={competence.name}
                                                value={competence.name}>
                                            {competence.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </select>
                        {formik.errors.expertise ?
                            <div className={"error-message"}>{formik.errors.expertise}</div> : null}
                    </div>
                    <div className={"inputGroup"}>
                        <label htmlFor={"monthsOfExperience"}>Experience within the field</label>
                        <input type={"number"}
                               min={"0"}
                               id={"monthsOfExperience"}
                               name={"monthsOfExperience"}
                               onChange={formik.handleChange}
                               onBlur={formik.handleBlur}
                               value={formik.values.monthsOfExperience}
                               placeholder={"months"}>
                        </input>
                        {formik.errors.monthsOfExperience ?
                            <div className={"error-message"}>{formik.errors.monthsOfExperience}</div> : null}
                    </div>
                    <button type={"submit"} className={"add"}>Add</button>
                </form>
                <div className={"userDataContainer"}>
                    <h2>Your competences</h2>
                    <ul>
                        {/* Render all choices */}
                        {competenceChoices.map((choice, index) => (
                            <li key={index}>
                                {choice.expertise}, {choice.monthsOfExperience} months <button className={"remove"}
                                                                                              onClick={() => handleRemoveCompetence(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button onClick={()=>validateFormAndProceed(handleCompetenceSave, competenceChoices)}>Next</button>
        </div>
    )
}