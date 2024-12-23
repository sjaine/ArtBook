import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage3({ formData, submitForm, setUserId }) {
    const navigate = useNavigate();

    // https://stackoverflow.com/questions/16025138/call-two-functions-from-same-onclick
    // https://chatgpt.com/share/673ff6b6-9230-8011-93b9-8422125b2a8b
    const submitGoNext = async (event) => {
        event.preventDefault();
        await submitForm(); 

        console.log("submitGoNext result: " + event);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname: formData.nickname }),
            credentials: 'include',
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                setUserId(data._id);
                // navigate("/list", { state: { userId: data._id } });
                navigate("/list");
            } else {
                console.error(data.message || "Failed to fetch user ID");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="signInBox">
                <div className="leftBox">
                    <img src="img/fisrtpage.svg" alt="animation" />
                </div>
                <div className="rightBox">
                    <form className="signInForm">
                        <div>
                            <div className="progressBar">
                                <div className="progress_three"></div>
                            </div>
                            <div className="body_text">Welcome, {formData.nickname}!</div>
                        </div>

                        <fieldset className="signIn_page3">
                            <div>🥳</div>
                            <div>You’re all set!</div>
                            <div>Your account has been created.</div>
                        </fieldset>

                        <fieldset className="btns btns_page3">
                            <button className="nextBtn form_btn" onClick={submitGoNext}>Done</button>
                        </fieldset>
                        
                    </form>
                </div>
            </div>
        </div>
      );
}

export default SignUpPage3;
