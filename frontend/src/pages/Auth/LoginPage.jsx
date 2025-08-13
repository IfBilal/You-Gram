import React from "react";
import AuthLayout from "../../components/Auth/AuthLayout";
import LoginForm from "../../components/Auth/LoginForm";
function LoginPage() {
  return (
    <>
      <AuthLayout buttonLabel="Create an Account" buttonLink="/register">
        <LoginForm />
      </AuthLayout>
    </>
  );
}

export default LoginPage;
