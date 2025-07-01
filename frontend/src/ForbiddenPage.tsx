import React from "react";
import { useNavigate } from "react-router-dom";
import { Icons } from "./components/ui/icons";
import { Button } from "./components/ui/button";
import ErrorImage from "@/assets/error.svg";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/auth/authentication");
  };

  return (
    <div className=" shrink h-screen relative overflow-hidden bg-[#078ECE] lg:bg-transparent">
      <div className="shrink min-h-screen flex items-center justify-center z-0">
        <img
          src={ErrorImage}
          alt="error page"
          className="object-cover h-dvh hidden lg:block"
        />
      </div>
      <div className="z-20 min-h-screen flex items-center justify-center flex-col absolute top-0 left-0 w-full">
        <div className="flex flex-col items-center justify-center p-3 mb-10 md:mb-0">
          <h1 className="text-white text-6xl md:text-8xl font-bold">403</h1>
          <h1 className="text-white text-xl md:text-2xl max-w-lg word-wrap">
            Forbidden
          </h1>
        </div>
        <div className="py-5">
          <Icons.UnauthorizedAccessIcon className="text-red-500 w-24 md:w-32 h-24 md:h-32" />
        </div>
        <div className="mt-20">
          <Button className="bg-white text-primary" onClick={navigateToHome}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
