import '../styling/forms.css'
import {Link} from 'react-router-dom';
import {useFormik} from 'formik'

/**
 * 
 * @param {function} updateAccountByEmailCode calls the /UpdateAccountByEmailCode api with entered username,
 * password and email code. 
 * @returns 
 */
export default function RestoreAccountDataView(props){
  const formik = useFormik({
    // Manage form state
    initialValues: {
        username: '',
        password: '',
        confirmPassword: '',
        resetCode: '',
    },
    // Submit form data
    onSubmit: async (values) => {
        formik.setSubmitting(false);
        await props.updateAccountByEmailCode(values);
    },
    // Validate
    validate: values => {
        let errors = {}
        if(!values.username){errors.username = "Required"}
        if(!values.password){errors.password = "Required"}
        if(!values.confirmPassword){errors.confirmPassword = "Required"}else if(values.confirmPassword !== values.password){
            errors.confirmPassword = "Must be the same as password"}
        if(!values.resetCode){errors.resetCode = "Required"}
        return errors
    }
})
  return <div className={"mainContainer"}>
  <h1>Register missing account data</h1>
  <div className={"inputContainer"}>
      <form onSubmit={formik.handleSubmit}>
          <div className="inputGroup">
              <label htmlFor={"username"}>Username</label>
              <input type={"text"} id={"username"} name={"username"}
                     onChange={formik.handleChange}
                     value={formik.values.username}/>
              {formik.errors.username ? <div className={"error-message"}>{formik.errors.username}</div> : null}
          </div>
          <div className="inputGroup">
              <label htmlFor={"password"}>Password</label>
              <input type={"password"} id={"password"} name={"password"}
                     onChange={formik.handleChange}
                     value={formik.values.password}/>
              {formik.errors.password ? <div className={"error-message"}>{formik.errors.password}</div> : null}
          </div>
          <div className="inputGroup">
              <label htmlFor={"password"}>Confirm password</label>
              <input type={"password"} id={"confirmPassword"} name={"confirmPassword"}
                     onChange={formik.handleChange} value={formik.values.confirmPassword}/>
              {formik.errors.confirmPassword ?  <div className={"error-message"}>{formik.errors.confirmPassword}</div> : null}
          </div>
          <div className="inputGroup">
              <label htmlFor={"resetCode"}>Enter reset code from your email</label>
              <input type={"text"} id={"resetCode"} name={"resetCode"}
                     onChange={formik.handleChange} value={formik.values.resetCode}/>
              {formik.errors.resetCode ?  <div className={"error-message"}>{formik.errors.resetCode}</div> : null}
          </div>
      <button type={"submit"}>Register</button>
      </form>
  </div>
  <p>Already have an account? <Link to={"/"}>Sign in</Link></p>
</div>

}