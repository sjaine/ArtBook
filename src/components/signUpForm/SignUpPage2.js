import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage2({ formData, setFormData, nextStep, prevStep }) {
    const navigate = useNavigate();
    const [nicknameError, setNicknameError] = useState("");
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);
    const [isInputChanged, setIsInputChanged] = useState(false);

    // https://chatgpt.com/share/673ff5d5-fad8-8011-87e5-5bb8b0f32fbc 
    const handleNicknameChange = async (e) => {
        const value = e.target.value;
        setFormData({ ...formData, nickname: e.target.value });

        // Validate nickname on change
        await validateNickname(value);
        setHasChecked(true);
        if (!isInputChanged) setIsInputChanged(true);
    };

    // Validate does nickname is already exisitng 
    const validateNickname = async (nickname) => {
        if (!nickname.trim()) {
            setNicknameError("Nickname is required.");
            return false;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/check-nickname?nickname=${nickname}`);
            const { isAvailable } = await response.json();
    
            if (!isAvailable) {
                setNicknameError("Sorry, that username is already taken!");
                return false;
            }
    
            setNicknameError(""); // No errors
            return true;
        } catch (error) {
            setNicknameError("Error checking nickname availability. Please try again.");
            return false;
        }
    };
    

    const handleNextClick = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsCheckingNickname(true); // Show a loading state if checking is required

        const isValid = await validateNickname(formData.nickname);
        setIsCheckingNickname(false);

        if (isValid) {
            nextStep(); // Proceed to the next step
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
                            <div className="progress_two"></div>
                        </div>
                        <div className="body_text">Sign up to ARTBOOK!</div>
                    </div>
                        
                    <fieldset className="nickname">
                        <div className="showEmoji">
                            <div>{formData.emojis}</div>
                        </div>

                        <div>Set Your Username</div>
                        <div className={`name_input ${nicknameError ? "error_state" : ""}`}>
                            <input type="text" value={formData.nickname} placeholder="Name" onChange={handleNicknameChange} />
                            <img src="img/name.svg" alt="name" className="nameImg" />
                            {nicknameError && <div className="error">{nicknameError}</div>}
                            {hasChecked && ( 
                                <img
                                    src={nicknameError ? "img/error.svg" : "img/success.svg"}
                                    alt={nicknameError ? "error" : "success"}
                                    className="errorImg"
                                />
                            )}
                        </div>  
                    </fieldset>

                    <fieldset className="btns">
                        <button className="skipBtn form_btn" onClick={prevStep}>Before</button>
                        <div>Already have an account? <div className="signIn" onClick={() => navigate("/sign-in")}>Sign in</div></div>
                        <button
                                className={`nextBtn form_btn ${
                                    !isInputChanged ? "initial_state_btn" : ""
                                } ${nicknameError ? "initial_state_btn" : ""}`}
                                onClick={handleNextClick}
                            >
                                {isCheckingNickname ? "Checking..." : "Next"}
                                <img src="img/nextArrow.svg" alt="right arrow" />
                        </button>
                    </fieldset>
                </form>
            </div>
        </div>
    </div>
  );
}

export default SignUpPage2;
