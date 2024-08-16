import {Link} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import React from "react";
/**
 * View to be shown to user if they are unauthorized to access the page
 * @returns server error message
 */
export default function UnauthorizedView() {
    const navigate = useNavigate();
    return (<>
        <h2>Ooops</h2>
        <div>Service unavailable, you are not authorized to view this page</div>
        <button onClick={() => {navigate("/user")}}>Go back</button>
    </>)
}