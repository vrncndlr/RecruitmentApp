import SendRestoreUserdataEmailView from "../view/SendRestoreUserdataEmailView"
import RestoreAccountDataView from "../view/RestoreAccountDataView"
import AccountUpdatedByEmailView from "../view/AccountUpdatedByEmailView"
import { useState } from "react";
import { restoreAccountByEmail, updateAccountByEmail } from '../integration/DBCaller'
import AccountUpdateErrorView from "../view/AccountUpdateErrorView";
import { useNavigate } from "react-router-dom";

/**
 * Presenter that handles logic and state for updating user accounts that are missing username and password
 * @returns The relevant views successful and unsuccessful account update attempts.
 */
export default function MissingUserDataUpdate(props) {
  const [restoreEmailSent, setRestoreEmailSent] = useState(false);
  const [accountUpdated, setAccountUpdated] = useState(false);
  const [error, setError] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [emailNotFound, setEmailNotFound] = useState(false)
  const navigate = useNavigate();

  /**
   * Takes the new username, password and emailed account restoration code and calls the
   * /UpdateAccountByEmailCode api on the backend.
   * @param {Object} formData form with username, password, confirmPassword and emailCode fields
   */
  async function updateAccountByEmailCode(formData) {
    try {
      formData.email = userEmail;
      const result = await updateAccountByEmail(formData);
      console.log("restore account result in presenter")
      console.log(result)
      setRestoreEmailSent(false);
      setAccountUpdated(true);
    } catch (e) {
      setError(true)
      setRestoreEmailSent(false);
      setAccountUpdated(false);
      console.log("error when trying to update account data" + e)
    }
  }

  /**
   * Takes email address and checks if the account exists on the backend and 
   * if the corresponding account is missing username and password. 
   * If so, an account restoration code will be sent to this email address.
   * @param {String} email Address to the user that is missing data
   */
  async function sendResetEmail(email) {
    try {
      console.log("jsoning email")
      setUserEmail(email.email)
      console.log(JSON.stringify(email))
      const result = await restoreAccountByEmail(email)
      console.log(result)
      console.log(result.emailSent)
      if (result === 404) {
        setEmailNotFound(true)
      }
      if (result === 500) {
        navigate("/error")
      }
      else if (result.emailSent)
        setRestoreEmailSent(true);
    } catch (e) {
      console.log(e)
      navigate("/error");
    }
  }

  return <>
    <div>{!error && !restoreEmailSent && !accountUpdated &&
      <SendRestoreUserdataEmailView
        emailNotFound={emailNotFound}
        sendResetEmail={sendResetEmail} />}</div>
    <div>{!error && restoreEmailSent && !accountUpdated &&
      <RestoreAccountDataView
        updateAccountByEmailCode={updateAccountByEmailCode} />}</div>

    <div>{!error && accountUpdated && <AccountUpdatedByEmailView />}</div>
    <div>{error && <AccountUpdateErrorView />}</div>
  </>
}