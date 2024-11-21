import React from 'react';

function SignUpStep3({ formData, submitForm }) {
  return (
    <div>
      <h2>Welcome, {formData.nickname}!</h2>
      <p>Your selected emoji: {formData.emojis}</p>
      <button onClick={submitForm}>Submit</button>
    </div>
  );
}

export default SignUpStep3;
