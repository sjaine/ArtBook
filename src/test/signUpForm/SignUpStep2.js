import React from 'react';

function SignUpStep2({ formData, setFormData, nextStep }) {
  const handleNicknameChange = (e) => {
    setFormData({ ...formData, nickname: e.target.value });
  };

  return (
    <div>
      <h2>Enter Your Nickname</h2>
      <input
        type="text"
        value={formData.nickname}
        onChange={handleNicknameChange}
      />
      <button onClick={nextStep}>Next</button>
    </div>
  );
}

export default SignUpStep2;
