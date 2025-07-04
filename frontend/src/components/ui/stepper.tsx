// Stepper.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useStepper } from "@/hooks/useStepper";
import { Icons } from "./icons";

type StepperProps = {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
  children: React.ReactNode;
  submitButtonText?: string;
  isLoading?: boolean;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onNext,
  onPrevious,
  onSubmit,
  children,
  submitButtonText = "Submit",
  isLoading = false,
}) => {
  const { orientation } = useStepper();

  const handleNextStep = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div>
      <div
        className={cn("flex", {
          "flex-col items-start": orientation === "vertical",
          "justify-center mb-8": orientation === "horizontal",
        })}
      >
        {steps.map((step, index) => (
          <div
            key={index}
            className={cn("flex items-center", {
              "mb-4": orientation === "vertical",
              "mr-8":
                orientation === "horizontal" && index !== steps.length - 1,
            })}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold",
                {
                  "bg-green-500 text-white": index < currentStep,
                  "bg-blue-500 text-white": index === currentStep,
                  "bg-gray-300 text-gray-600": index > currentStep,
                },
              )}
            >
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="ml-4 text-sm">{step}</div>
            {orientation === "horizontal" && index !== steps.length - 1 && (
              <ArrowRight className="w-4 h-4 mx-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>
      <div>{children}</div>
      <div
        className={cn("flex mt-8", {
          "justify-between": orientation === "horizontal",
          "flex-col items-start space-y-4": orientation === "vertical",
        })}
      >
        {currentStep > 0 && (
          <Button variant="outline" onClick={onPrevious} className="w-[120px]">
            Previous
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button onClick={handleNextStep} className="w-[120px]">
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isLoading}
            className="w-[120px]"
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading ? "Adding..." : `${submitButtonText}`}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Stepper;
