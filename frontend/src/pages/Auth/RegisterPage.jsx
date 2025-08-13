import React from 'react'
import AuthLayout from "../../components/Auth/AuthLayout";
import RegisterForm from '../../components/Auth/RegisterForm';
function RegisterPage() {
  return (
    <>
      <AuthLayout buttonLabel="Have an account?" buttonLink="/">
        <RegisterForm/>
      </AuthLayout>
    </>
  );
}

export default RegisterPage