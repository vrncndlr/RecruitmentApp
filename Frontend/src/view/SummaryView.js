import {useNavigate} from "react-router-dom";
import {useState} from "react";

export default SummaryView;
/**
 * Renders the view for the summary of an application before it is sent.
 * @param user user data.
 * @param formdata the data from the forms.
 * @param sendApplication send application button
 * @param resetFormAndComponent reset button
 * @returns view of the application data
 */
function SummaryView({user, formData, sendApplication, resetFormAndComponent}) {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    async function onSend(){
        const data = {...formData, person_id: user.person_id}
        try {
            const response = await sendApplication(data);
            console.log(response);
            if(response) {
                console.log("Application sent successfully: ", data, response);
                navigate('/user');
            }
        } catch (e){
            console.error(e);
        }
    }
    async function onCancel(){
        await resetFormAndComponent();
    }

    return (
        <div className={""}>
            <h2>Your selected competences</h2>
            <ul>
                {formData.competences.map((competence, index) => (
                    <p key={index}>
                        {competence.expertise}, {competence.monthsOfExperience} months experience
                    </p>
                ))}
            </ul>
            <h2>Your selected availabilities</h2>
            <ul>
                {formData.availabilities.map((availability, index) => (
                    <p key={index}>
                        {availability.from_date} - {availability.to_date}
                    </p>
                ))}
            </ul>
            <p>If everything looks in order, feel free to submit</p>
            <button type={"submit"} onClick={() => onSend()}>Submit application</button><button className={"cancel"} onClick={onCancel}>Cancel</button>
        </div>
    )
}