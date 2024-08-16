import React, { useState, useEffect } from "react";
import UserView from "../view/UserView";
import { getCompetences, getAvailabilities } from "../integration/DBCaller";
import { useNavigate } from "react-router-dom";

/**
 * Full view of job applications that the user can see
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function User({ user }) {
    const [competenceArray, setCompetenceArray] = useState([]);
    const [availabilityArray, setAvailabilityArray] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetchUserCompetences();
    }, []);
    useEffect(() => {
        fetchUserAvailabilities();
    }, [])
    async function fetchUserCompetences() {
        const person_id = user.person_id;
        try {
            const response = await getCompetences(person_id);
            if (response === undefined)
                throw new Error();
            setCompetenceArray(response);
        } catch (e) {
            console.error(e);
            navigate("/error")
        }
    }
    async function fetchUserAvailabilities() {
        const person_id = user.person_id;
        try {
            const response = await getAvailabilities(person_id);
            if (response === undefined)
                throw new Error();
            setAvailabilityArray(response);
        } catch (e) {
            console.error(e);
            navigate("/error")
        }
    }

    return (<div>
        <UserView user={user} competenceArray={competenceArray} availabilityArray={availabilityArray} />
    </div>
    )
}