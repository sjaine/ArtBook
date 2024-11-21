import React, { useState } from 'react';
import SignInPage1 from './SignInPage1';
import SignInPage2 from './SignInPage2';
import SignInPage3 from './SignInPage3';

function SignUpForm({ setUserId }) {
  const [formData, setFormData] = useState({ emojis: '', nickname: '' });
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);
  
  const submitForm = async () => {
    try {
      const response = await fetch('https://artbook-x9c3.onrender.com/api/user', {
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
        <SignInPage1 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 2 && (
        <SignInPage2 formData={formData} setFormData={setFormData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {step === 3 && (
        <SignInPage3 formData={formData} submitForm={submitForm} setUserId={setUserId} prevStep={prevStep} />
      )}
    </div>
  );
}

export default SignUpForm;
