import OverviewView from "../view/OverviewView";
import Error from "../view/ErrorView";
import React, { useState } from "react";
import { fetchApplicants } from "../integration/DBCaller";
import { useNavigate } from "react-router-dom";

/**
 * Gets application data from DBCaller to set user state and pass to OverviewView
 * @returns {Element}
 * @constructor
 */
export default function Overview() {
    const sortOptions = ["First name", "Surname", "Application status"]
    const [applicationsObject, setApplicationsObject] = useState(null);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    async function getApplications() {
        if (!applicationsObject) {
            try {
                const response = await fetchApplicants();
                if (response === 500) {
                    setError(true)
                    navigate("/error")
                    window.location.reload();
                }
                await setApplicationsObject(response);
            } catch (e) {
                console.log('Error in presenter fetching data')
            }
        }
    }
    function sortApplications(variable) {
        //TODO sort according to variable
    }
    async function onApplication(person_id) {
        //TODO
    }

    return (<>{!error && <OverviewView
        loadApplications={getApplications()}
        applications={applicationsObject}
        onApplication={onApplication()}
        sortOptions={sortOptions}
        onSort={sortApplications()}
    />}
        {error && <Error />}
    </>)
}