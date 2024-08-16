import React, { useState, useEffect } from "react";
import UserInformationView from "../view/UserInformationView"
import CompetenceView from "../view/CompetenceView"
import AvailabilityView from "../view/AvailabilityView"
import SummaryView from "../view/SummaryView"
import { fetchTable, saveUpdatedData, setAvailability, setCompetence } from '../integration/DBCaller'
import Error from "../view/ErrorView";
import NavigationBar from "../components/NavigationBar";

/**
 * The interface for an authenticated user with role_id 2. The user can submit an application from here
 * Data is persistent with sessionStorage
 * @param props
 */
export default function Applicant({ user, handleLogout }) {
    const [competenceObject, setCompetenceObject] = useState(null);
    const [updated, setUpdated] = useState(false);
    const [activeComponent, setActiveComponent] = useState(1);
    const [applicationSubmitted, setApplicationSubmitted] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const storedActiveComponent = sessionStorage.getItem('activeComponent');
        if (storedActiveComponent !== null && storedActiveComponent !== undefined) {
            setActiveComponent(JSON.parse(storedActiveComponent));
        } else {
            setActiveComponent(1);
        }
    }, []);

    const [formData, setFormData] = useState({
        competences: [],
        availabilities: []
    });
    useEffect(() => {
        const storedFormData = sessionStorage.getItem('formData');
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));
        }
    }, []);

    /**
     * Controls what view is active. Uses sessionStorage for persistence
     */
    const showNext = () => {
        const storedActiveComponent = sessionStorage.getItem('activeComponent') || 1;
        if (storedActiveComponent) {
            const nextComponent = JSON.parse(storedActiveComponent) + 1;
            setActiveComponent(nextComponent);
            sessionStorage.setItem('activeComponent', JSON.stringify(nextComponent));
        }
    };

    /**
     * Update the presenter with new data
     * @param data the data to be updated.
     */
    async function updateData(data) {
        try {
            const response = await saveUpdatedData(data);
            if (response) {
                console.log("User info updated successfully ", response);
                setUpdated(true);
            }
        } catch (e) {
            console.error("Error saving user information: ", e);
            setError(true)
        }
    }

    /**
     * Fetching rows from table competence in db,
     */
    useEffect(() => {
        fetchCompetenceAreas();
    }, []);
    async function fetchCompetenceAreas() {
        if (!competenceObject) {
            try {
                const response = await fetchTable();
                if (response == 500) {
                    console.log("unauthprized")
                    throw new Error('server unavailable')
                }
                await setCompetenceObject(response);
            } catch (e) {
                console.error(e);
                setError(true);
            }
        }
    }

    /**
     * Stores the form data between views, also appends to existing array of data
     * @param competenceData The areas of expertise and amount of experience input by the user
     */
    const handleCompetenceSave = (competenceData) => {
        setFormData(prevData => ({
            ...prevData,
            competences: [...prevData.competences, ...competenceData]
        }));
        const storedFormData = sessionStorage.getItem('formData');
        const existingFormData = storedFormData ? JSON.parse(storedFormData) : { competences: [], availabilities: [] };
        const updatedCompetences = {
            competences: [...existingFormData.competences, ...competenceData],
            availabilities: existingFormData.availabilities
        }
        sessionStorage.setItem('formData', JSON.stringify(updatedCompetences));
        showNext();
    };

    /**
     * @param availabilityData The availability periods input by the user
     */
    const handleAvailabilitySave = (availabilityData) => {
        setFormData(prevData => ({
            ...prevData,
            availabilities: [...prevData.availabilities, ...availabilityData]
        }));
        const storedFormData = sessionStorage.getItem('formData');
        const existingFormData = storedFormData ? JSON.parse(storedFormData) : { competences: [], availabilities: [] };
        const updatedAvailabilities = {
            competences: existingFormData.competences,
            availabilities: [...existingFormData.availabilities, ...availabilityData]
        }
        sessionStorage.setItem('formData', JSON.stringify(updatedAvailabilities));
        showNext();
    }

    /**
     * Resets the form upon the users request
     */
    async function resetFormAndComponent() {
        setFormData({
            competences: [],
            availabilities: []
        });
        sessionStorage.removeItem('formData');
        setActiveComponent(1);
        sessionStorage.setItem('activeComponent', JSON.stringify(1));
    }
    /**
     * Sends the users application by calling sendCompetence and sendAvailability in the DBCaller
     * @param data
     * @returns {Promise<void>}
     */
    async function sendApplication(data) {
        try {
            const { competences, availabilities, person_id } = data;

            const competenceData = competences.map(({ competence_id, monthsOfExperience }) => ({
                competence_id,
                person_id,
                monthsOfExperience
            }));
            const availabilityData = availabilities.map(({ from_date, to_date }) => ({
                person_id,
                from_date,
                to_date
            }));

            const responseCompetence = await sendCompetence(competenceData);
            const responseAvailability = await sendAvailability(availabilityData);
            if (responseCompetence && responseAvailability) {
                setApplicationSubmitted(true);
                console.log("Application sent successfully");
                return true;
            } else {
                console.log("Submitting application was unsuccessful");
                return false;
            }
        } catch (error) {
            console.error("Error submitting application:", error);
            return false;
        }
    }

    /**
 * Sends the users competence by calling 'setCompetence' in the DBCaller
 * @param competences
 * @returns {Promise<void>}
 */
    async function sendCompetence(competences) {
        try {
            const responses = await Promise.all(competences.map(competence => setCompetence(competence)));
            return responses.every(response => response !== null);
        } catch (e) {
            console.error("Error sending competences:", e);
            setError(true);
        }
    }
    /**
 * Sends the users availability by calling 'setAvailability' in the DBCaller
 * @param availabilities to be saved
 * @returns response
 */
    async function sendAvailability(availabilities) {
        try {
            const responses = await Promise.all(availabilities.map(availability => setAvailability(availability)));
            return responses.every(response => response !== null);
        } catch (e) {
            console.error("Error sending availabilities:", e);
        }
    }
    return (<div>

        {activeComponent === 1 && !error && <UserInformationView user={user} handleSave={updateData} showNext={showNext} />}
        {activeComponent === 2 && !error && <CompetenceView competences={competenceObject} handleCompetenceSave={handleCompetenceSave} fetchCompetenceAreas={fetchCompetenceAreas} showNext={showNext} />}
        {activeComponent === 3 && !error && <AvailabilityView handleAvailabilitySave={handleAvailabilitySave} showNext={showNext} />}
        {activeComponent === 4 && !error && <SummaryView formData={formData} sendApplication={sendApplication} resetFormAndComponent={resetFormAndComponent} user={user} />}
        {error && <Error />}
    </div>);
}