import React, { useState } from 'react';
import SignUpPage1 from './SignUpPage1';
import SignUpPage2 from './SignUpPage2';
import SignUpPage3 from './SignUpPage3';

// https://chatgpt.com/share/673ff712-21d4-8011-bafa-89186631c64a
// https://chatgpt.com/share/6723df3e-f67c-8011-a67f-69281ab33bea

function SignUpForm({ setUserId }) {
  const [formData, setFormData] = useState({ emojis: '', nickname: '' });
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  // Create new user data
  const submitForm = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });
      if (response.ok) {
        console.log('Data submitted successfully');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div>
      {step === 1 && (
        <SignUpPage1 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 2 && (
        <SignUpPage2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <SignUpPage3 formData={formData} submitForm={submitForm} setUserId={setUserId} prevStep={prevStep} />
      )}
    </div>
  );
}

export default SignUpForm;
