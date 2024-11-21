import React from 'react';
import { useNavigate } from 'react-router-dom';

function SignInPage3({ formData, submitForm, setUserId }) {
    const navigate = useNavigate();

    return (
        <div>
            <div className="signInBox">
                <div className="leftBox">
                    <img src="img/fisrtpage.svg" alt="animation" />
                </div>
                <div className="rightBox first_right">
                    <img src="img/logo.svg" alt="logo" />
                    <div className="top">
                        <div>Welcome to ARTBOOK!</div>
                        <div>Let's explore and discover art together</div>
                    </div>
                    <div className="first_btns">
                        <div onClick={() => navigate("/sign-up")}>Sign up</div>
                        <div onClick={() => navigate("/sign-in")}>Sign in</div>
                    </div>
                </div>
            </div>
        </div>
      );
}

export default SignInPage3;
