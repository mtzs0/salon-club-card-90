import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (step: number) => void;
  completedSteps: number[];
}

export const StepIndicator = ({
  steps,
  currentStep,
  onStepClick,
  completedSteps,
}: StepIndicatorProps) => {
  const isCompleted = (stepNumber: number) => completedSteps.includes(stepNumber);
  const isActive = (stepNumber: number) => stepNumber === currentStep;
  const isClickable = (stepNumber: number) => 
    isCompleted(stepNumber) || stepNumber < currentStep;

  return (
    <div className="flex items-center justify-center w-full px-4 py-6">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          {/* Step Circle */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => isClickable(step.number) && onStepClick(step.number)}
              disabled={!isClickable(step.number) && !isActive(step.number)}
              className={cn(
                "step-circle",
                isCompleted(step.number) && "step-circle-completed cursor-pointer hover:scale-105",
                isActive(step.number) && !isCompleted(step.number) && "step-circle-active",
                !isActive(step.number) && !isCompleted(step.number) && "step-circle-inactive",
                isClickable(step.number) && "cursor-pointer hover:scale-105"
              )}
              aria-label={`${step.label} - Step ${step.number}`}
            >
              {isCompleted(step.number) ? (
                <Check className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                step.number
              )}
            </button>
            <span
              className={cn(
                "mt-2 text-xs font-medium transition-colors duration-300",
                isActive(step.number) || isCompleted(step.number)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div
              className={cn(
                "step-connector w-12 sm:w-20 mb-6",
                isCompleted(step.number) ? "step-connector-active" : "step-connector-inactive"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};
