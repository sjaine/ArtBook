import React, { useState } from 'react';
import SignUpStep1 from './SignUpStep1';
import SignUpStep2 from './SignUpStep2';
import SignUpStep3 from './SignUpStep3';

function SignUpForm() {
  const [formData, setFormData] = useState({ emojis: '', nickname: '' });
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  
  const submitForm = async () => {
    try {
      const response = await fetch('https://artbook-x9c3.onrender.com/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
        <SignUpStep1 formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 2 && (
        <SignUpStep2 formData={formData} setFormData={setFormData} nextStep={nextStep} />
      )}
      {step === 3 && (
        <SignUpStep3 formData={formData} submitForm={submitForm} />
      )}
    </div>
  );
}

export default SignUpForm;
