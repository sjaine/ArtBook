import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignIn({ setUserId }) {
    
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [hasChecked, setHasChecked] = useState(false);

    // Validate does it really existing
    // https://chatgpt.com/share/673ff5d5-fad8-8011-87e5-5bb8b0f32fbc
    const handleSignIn = async () => {
        if (!nickname.trim()) {
            setNicknameError("Nickname is required.");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/get-id`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname }),
                credentials: 'include',
            });

            if (response.ok) {
                const user = await response.json();
                setUserId(user._id); 
                navigate('/list'); 
            } else {
                const errorData = await response.json();
                setNicknameError(errorData.message || "Sorry, that username does not exist!");
            }
        } catch (error) {
            setNicknameError("Failed to sign in. Please try again.");
        }

        setHasChecked(true);
    };

    const handleNicknameChange = (e) => {
        setNickname(e.target.value);
        setNicknameError(""); 
        setHasChecked(false); 
    };

    return (
        <div>
            <div className="signInBox">
                <div className="leftBox">
                    <img src="img/fisrtpage.svg" alt="animation" />
                </div>
                <div className="rightBox signIn_right">
                    <div>
                        <div className="bigEmo">🙌</div>
                        <div className="top signIn_top">
                            <div>Sign in Here!</div>
                            <div>Welcome back to ARTBOOK</div>
                        </div>
                    </div>
                    <fieldset className="signIn_fieldset">
                        <div className="signIn_bottom">
                            <div className={`name_input ${nicknameError ? "error_state" : ""}`}>
                                <input type="text" value={nickname} placeholder="Username" onChange={handleNicknameChange} />
                                <img src="img/name.svg" alt="name" className="nameImg"  />
                                {nicknameError && <div className="error">{nicknameError}</div>}
                            {hasChecked && ( 
                                <img
                                    src="img/error.svg"
                                    alt="error"
                                    className="errorImg"
                                />
                                )}
                            </div>  
                            <button className="signInBtn" onClick={handleSignIn}>Sign in</button>
                        </div>
                    </fieldset>
                    <div className="goToSignUp">
                        <div>Don't have an account?</div>
                        <div onClick={() => navigate("/sign-up")}>Sign up</div>
                    </div>
                </div>
            </div>
        </div>
      );
}

export default SignIn;
