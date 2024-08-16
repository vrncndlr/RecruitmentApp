//const backendURL = 'http://localhost:8000/';
const backendURL = 'https://archdes-abbcfaefce39.herokuapp.com/'

/**
 * Calls backend api to authenticate a user on login. 
 * @param {Object} usernameAndPassword takes argument on the form of: {username: 'username', password:'pw'}
 * @returns a user json object on a succesful authentication, 
 * otherwise returns an int with the http error status.
 */
async function Authenticate(usernameAndPassword) {
  const URL = 'login';
  const response = await callAPI(URL, usernameAndPassword);
  console.log("jwt: " + response.JWTToken)
  //document.cookie = "JWTToken=" + response.JWTToken + ";SameSite=None; Secure: true";
  const cookie = sessionStorage.setItem('cookie', "JWTToken=" + response.JWTToken + ";SameSite=None; Secure: true");
  return response;
}
/**
 * Only works if the authorisation cookie is the first one of all the cookies. 
 * @param {String} cookies All current cookies
 * @returns the JWTToken used for authorisation against the backend. 
 */
function getAuthCookie(cookies) {
  return cookies.split(';')[0].split('=')[1];
}
/**
 * Calls the API to check if account with this email exists and if it is missing username and password.
 * If so, an email will to this email address with a restoration code.
 * @param {String} email User email address as string
 * @returns HTTP response containing {emailSent:true} if the restoration code was sent,
 * 404 response otherwise.
 */
async function restoreAccountByEmail(email) {
  const URL = 'restoreAccountByEmail';
  return await callAPI(URL, email);
}

/**
 * Calls the API to set the username and password for the user with this email address if the restoration
 * code is the same as the latest that was sent out.
 * @param {Object} userdata Has username, password, email and resetCode fields.
 * @returns 
 */
async function updateAccountByEmail(userdata) {
  const URL = 'updateAccountByEmailCode';
  return await callAPI(URL, userdata);
}

/**
 * This function calls the root api address plus the supplied URL and returns the HTTP response.
 * @param {String} url The API URL that will be called
 * @param {Object} data Will be sent in a POST request to the above address.
 * @returns HTTP response if response status is 200, otherwise returns response status code.
 */
async function callAPI(url, data) {
  const URL = backendURL+url;
  try {
    const response = await fetch(URL,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      }
      , { mode:'cors'},);
    if (response.status !== 200)
      return response.status;
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
}

/**
 * Calls backend api to register a new user by making a POST request
 * @param userdata takes the user data as a single object
 * @returns {Promise<boolean>} True if response status is 200 or 201
 */
async function saveRegistrationData(userdata) {
  const URL = backendURL + 'registration'
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      body: JSON.stringify(userdata),
      mode: 'cors'
    });
    if (response.ok) {
      return true;
    }
    else {
      throw new Error('Failed to save registration data');
    }
  } catch (error) {
    console.error('Error saving registration data:', error);
    return false;
  }
}

/**
 * Calls the api function that updates the rows in the table 'person'
 * @param data
 * @returns {Promise<boolean>}
 */
async function saveUpdatedData(data) {
  const URL = backendURL + 'update';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      body: JSON.stringify(data),
      mode: 'cors'
    });
    if (response.status === 201) {
      console.log("Update successful")
      return true;
    }
    if (!response.ok) {
      throw new Error('Failed to update personal information');
    }
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}

/**
 * Calls the api that gets the rows contents from the table 'competences'
 * @returns {Promise<number|any>}
 */
async function fetchTable() {
  console.log("cookies: " + document.cookie);
  const URL = backendURL + 'fetch';
  try {
    const response = await fetch(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      mode: 'cors'
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error:', response.status);
      return null;
    }
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}

/**
 * Calls the endpoint api that sets the rows contents from the table 'competence_profile'
 * @param competenceData
 * @returns {Promise<number>}
 */
async function setCompetence(competenceData) {
  const URL = backendURL + 'setCompetence';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      body: JSON.stringify(competenceData),
      mode: 'cors'
    });
    if (response.ok) {
      console.log("Competence added.")
      return true;
    }
    else {
      return false;
    }
  } catch (e) {
    console.error(e);
    throw new Error();
  }
}

/**
 * Calls the api that sets the rows contents from the table 'availability'
 * @param availabilityData
 * @returns {Promise<void>}
 */
async function setAvailability(availabilityData) {
  const URL = backendURL + 'setAvailability';
  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      body: JSON.stringify(availabilityData),
      mode: 'cors'
    });
    if (response.ok) {
      console.log("Availability added.")
      return true;
    }
    else {
      return false;
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Calls api to fetch names and status of applicants names from database
 * @returns {Promise<number|JSX.Element|any>}
 */
async function fetchApplicants() {
  const URL = backendURL + 'fetchApplicants';
  try {
    const response = await fetch(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      mode: 'cors'
    });
    if (!response.status) return <div>Loading</div>
    if (!response.ok) {
      return response.status;
    }
    return await response.json();;
  } catch (e) {
    console.error('Error fetching data', e);
  }
}

/**
 * Calls api to fetch competences for an applicant from database
 * @param person_id 
 * @returns 
 */
async function getCompetences(person_id) {
  const URL = backendURL + `getCompetences/${person_id}`;
  console.log("authcookie: " + getAuthCookie(sessionStorage.getItem('cookie')))
  try {
    const response = await fetch(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      mode: 'cors'
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error:', response.status);
      return null;
    }
  } catch (e) {
    console.error(e)
    return e;
  }
}

/**
 * Calls api to fetch availabilities for an applicant from database
 * @param person_id 
 * @returns 
 */
async function getAvailabilities(person_id) {
  const URL = backendURL + `getAvailabilities/${person_id}`;
  try {
    const response = await fetch(URL, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'authcookie': getAuthCookie(sessionStorage.getItem('cookie')),
      },
      mode: 'cors'
    });
    if (response.ok) {
      return await response.json();
    } else {
      console.error('Error:', response.status);
      return null;
    }
  } catch (e) {
    console.error(e)
  }
}


export {
  Authenticate, restoreAccountByEmail, saveRegistrationData,
  updateAccountByEmail, fetchTable, saveUpdatedData, setCompetence,
  setAvailability, fetchApplicants, getCompetences, getAvailabilities
}
