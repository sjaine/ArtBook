import React from 'react';

function SignUpStep1({ formData, setFormData, nextStep }) {
  const handleEmojiSelection = (emojis) => {
    setFormData({ ...formData, emojis });
    nextStep();
  };

  return (
    <div>
      <h2>Select an Emoji</h2>
      <div onClick={() => handleEmojiSelection('😊')}>😊</div>
      <div onClick={() => handleEmojiSelection('🎨')}>🎨</div>
      {/* Add more emojis as needed */}
    </div>
  );
}

export default SignUpStep1;
