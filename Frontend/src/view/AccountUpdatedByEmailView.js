import { Link } from 'react-router-dom';

/**
 * Message shown on successful update of user acount data.
 * @returns 
 */
export default function AccountUpdatedByEmailView() {
  return <p>Account data was successfully updated. Return to starting page to login <Link to={"/"}>Login here</Link></p>
}