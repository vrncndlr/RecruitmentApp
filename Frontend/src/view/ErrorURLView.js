import {Link} from 'react-router-dom';
import {useNavigate} from "react-router-dom";
import React from "react";
/**
 * View to be shown to user if there is a server error
 * @returns server error message
 */
export default function ErrorURLView() {
  const navigate = useNavigate();
  return (<>
    <h2>Server error</h2>
    <div>Service unavailable, contact the site admin if problem persists</div>
    <button onClick={() => {navigate("/");}}>return to start site</button>
  </>)
}