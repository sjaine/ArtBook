import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUpPage1({ formData, setFormData, nextStep }) {
    const [emoji, setEmoji] = useState("🙂");
    const navigate = useNavigate(); 

    useEffect(() => {
        setEmoji("🙂"); 
      }, []);

    const handleEmoji = (e) => {
        setEmoji(e.target.value);
    }

    const handleEmojiSelection = () => {
        setFormData({ ...formData, emojis: emoji });
        nextStep();
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
                                <div className="progress_one"></div>
                            </div>
                            <div className="body_text">Sign up to ARTBOOK!</div>
                        </div>
                        <fieldset className="emojis">
                            <div className="showEmoji">
                                <div>{emoji}</div>
                            </div>
                            <div>
                                <div>Select Your Emoji</div>
                                <div className="emoji_radio">
                                    {/* Custom CheckBox */}
                                    {/* https://www.w3schools.com/howto/howto_css_custom_checkbox.asp */}
                                    <label htmlFor="smile" className="emojiContainer">
                                        <input type="radio" name="emojis" id="smile" value="🙂" onClick={handleEmoji} defaultChecked />
                                        <span className="checkmark">🙂</span>
                                    </label>

                                    <label htmlFor="game" className="emojiContainer">
                                        <input type="radio" name="emojis" id="game" value="🎮" onClick={handleEmoji} />
                                        <span className="checkmark">🎮</span>
                                    </label>

                                    <label htmlFor="palette" className="emojiContainer">
                                        <input type="radio" name="emojis" id="palette" value="🎨" onClick={handleEmoji} />
                                        <span className="checkmark">🎨</span>
                                    </label>

                                    <label htmlFor="flower" className="emojiContainer">
                                        <input type="radio" name="emojis" id="flower" value="🌸" onClick={handleEmoji} />
                                        <span className="checkmark">🌸</span>
                                    </label>

                                    <label htmlFor="camera" className="emojiContainer">
                                        <input type="radio" name="emojis" id="camera" value="📸" onClick={handleEmoji} />
                                        <span className="checkmark">📸</span>
                                    </label>

                                    <label htmlFor="cat" className="emojiContainer">
                                        <input type="radio" name="emojis" id="cat" value="🐱" onClick={handleEmoji} />
                                        <span className="checkmark">🐱</span>
                                    </label>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="btns">
                            <button className="skipBtn form_btn" onClick={() => navigate("/")}>Cancel</button>
                            <div>Already have an account? <div className="signIn" onClick={() => navigate("/sign-in")}>Sign in</div></div>
                            <button className="nextBtn form_btn" onClick={() => handleEmojiSelection(emoji)}>Next <img src="img/nextArrow.svg" alt="right arrow" /></button>
                        </fieldset>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage1;


