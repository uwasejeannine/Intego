import { useState } from "react";
import { UserAuthForm } from "@/components/forms/authentication/login-form";
import IntegoImage from "@/assets/intego.svg";
import logoImage from "@/assets/logo.svg";
import { VerificationCodeForm } from "@/components/forms/authentication/verification-code-form";
import { ChangePasswordForm } from "@/components/forms/authentication/change-password-form";
import { ForceChangePasswordForm } from "@/components/forms/authentication/force-password-change";
import { PasswordResetForm } from "@/components/forms/authentication/forgot-password-form";
import { useLocation, useNavigate } from "react-router-dom";

export function AuthenticationPage() {
  const [, setShowLoginForm] = useState<boolean>(true);
  const [, setShowVerificationCodeForm] = useState<boolean>(false);
  const [, setShowResetPasswordForm] = useState<boolean>(false);
  const location = useLocation();

  const navigate = useNavigate();

  const handleForgotPasswordClick = () => {
    setShowLoginForm(false);
    navigate("/auth/forgot-password");
  };

  const handleBackToLoginClick = () => {
    setShowLoginForm(true);
    setShowVerificationCodeForm(false);
    setShowResetPasswordForm(false);
    navigate("/auth/login");
  };

  const handleSendVerificationCodeClick = () => {
    setShowLoginForm(false);
    setShowVerificationCodeForm(true);
    navigate("/auth/verify-email");
  };

  const handleVerifyCodeSubmit = () => {
    setShowVerificationCodeForm(false);
    setShowResetPasswordForm(true);
    navigate("/auth/reset-password");
  };

  const handleResetPasswordSubmit = () => {
    setShowResetPasswordForm(false);
    setShowLoginForm(true);
    navigate("/auth/login");
  };

  const renderForm = () => {
    switch (location.pathname) {
      case "/auth/login":
        return (
          <>
            <div className="form-title mb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm">
                Sign in by entering the information below
              </p>
            </div>
            <div className="form-card">
              <UserAuthForm onForgotPasswordClick={handleForgotPasswordClick} />
            </div>
          </>
        );

      case "/auth/forgot-password":
        return (
          <>
            <div className="form-title mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Forgot Password
              </h1>
              <p className="text-gray-500 text-base">
                Enter   email to verify   account
              </p>
            </div>
            <div className="form-card">
              <PasswordResetForm
                onBackToLoginClick={handleBackToLoginClick}
                onSendVerificationCodeClick={handleSendVerificationCodeClick}
              />
            </div>
          </>
        );
      case "/auth/verify-email":
        return (
          <>
            <div className="form-title mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Verification Code
              </h1>
              <p className="text-gray-500 text-base">
                Enter the verification code sent to   email
              </p>
            </div>
            <div className="form-card">
              <VerificationCodeForm
                onBackToLoginClick={handleBackToLoginClick}
                onSubmit={handleVerifyCodeSubmit}
              />
            </div>
          </>
        );
      case "/auth/reset-password":
        return (
          <>
            <div className="form-title mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Reset Password
              </h1>
              <p className="text-gray-500 text-base">
                Enter   new password
              </p>
            </div>
            <div className="form-card">
              <ChangePasswordForm onSubmit={handleResetPasswordSubmit} />
            </div>
          </>
        );
      case "/auth/force-password-change":
        return (
          <>
            <div className="form-title mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Change Password
              </h1>
              <p className="text-gray-500 text-base">
                Please change your password to continue.
              </p>
            </div>
            <div className="form-card">
              <ForceChangePasswordForm />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex relative" style={{ height: '520px' }}>
        
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col relative z-10">
          
          {/* Logo positioned at top left */}
          <div className="flex items-center mb-12">
            <div className="w-8 h-8 bg-[#137775] rounded-lg mr-3 flex items-center justify-center">
              <img
                src={logoImage}
                alt="system logo"
                className="w-5 h-5"
              />
            </div>
            <span className="text-lg font-semibold text-gray-700">Intego360</span>
          </div>

          {/* Authentication Form */}
          <div className="flex-1 flex flex-col justify-center -mt-4">
            {renderForm()}
          </div>
        </div>

        {/* Right Side - Curved Teal Section with Laptop */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0" style={{ width: 'calc(50% + 100px)' }}>
          {/* Curved background */}
          <div 
            className="h-full bg-gradient-to-br from-[#137775] to-[#144c49] relative flex items-center justify-center"
            style={{
              clipPath: 'ellipse(80% 100% at 100% 50%)'
            }}
          >
            {/* Image positioned to the left */}
            <div className="flex items-center pl-16">
              <img
                src={IntegoImage}
                alt="Rwanda Coat of Arms"
                className="max-w-[400px] max-h-[300px] object-contain"
              />       
            </div>
          </div>
        </div>

        {/* Mobile fallback for right section */}
        <div className="lg:hidden w-full bg-gradient-to-br from-[#137775] to-[#137775] p-8 flex items-center justify-center">
          <div className="text-center">
            <img
              src={IntegoImage}
              alt="Intego360"
              className="max-w-xs mx-auto mb-4"
            />
            <h3 className="text-white text-xl font-bold uppercase tracking-wider">
              Intego360
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthenticationPage;
