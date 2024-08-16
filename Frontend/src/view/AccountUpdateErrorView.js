import { Link } from 'react-router-dom';

/**
 * Error message shown when account data update failed for other reason than that the 
 * email doesnt exist or that the account already has username and password
 */
export default function AccountUpdateErrorView() {
  return (<>
    <div>Failed to updata user data</div>
    <p>Go back to start page? <Link to={"/"}>Return</Link></p>
  </>)
}