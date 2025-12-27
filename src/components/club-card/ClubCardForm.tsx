import { useState, useCallback } from "react";
import { StepIndicator } from "./StepIndicator";
import { Step1PersonalData, PersonalDataForm } from "./Step1PersonalData";
import { Step2Payment } from "./Step2Payment";
import { Step3Summary } from "./Step3Summary";

const FORM_STEPS = [
  { number: 1, label: "Adatok" },
  { number: 2, label: "Fizetés" },
  { number: 3, label: "Összegzés" },
];

const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateVendegId = (uuid: string, lastName: string): string => {
  const uuidPrefix = uuid.slice(0, 8);
  const lastNameUpper = lastName.toUpperCase();
  return `${uuidPrefix}-${lastNameUpper}`;
};

export const ClubCardForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [vendegUuid, setVendegUuid] = useState<string>("");
  const [vendegId, setVendegId] = useState<string>("");

  const [formData, setFormData] = useState<PersonalDataForm>({
    firstName: "",
    lastName: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    email: "",
    phone: "+36 ",
    acceptedPrivacy: false,
  });

  const handleStepClick = useCallback(
    (step: number) => {
      // Only allow going back to completed steps or previous steps
      if (completedSteps.includes(step) || step < currentStep) {
        setCurrentStep(step);
      }
    },
    [completedSteps, currentStep]
  );

  const handleFormChange = useCallback((data: PersonalDataForm) => {
    setFormData(data);
  }, []);

  const handleStep1Complete = useCallback((overrideData?: PersonalDataForm) => {
    const dataToUse = overrideData || formData;
    
    // Generate UUID and vendeg_id
    const uuid = generateUUID();
    const id = generateVendegId(uuid, dataToUse.lastName);
    setVendegUuid(uuid);
    setVendegId(id);

    // If using override data, also update the form state
    if (overrideData) {
      setFormData(overrideData);
    }

    // Mark step 1 as completed and move to step 2
    setCompletedSteps((prev) => [...prev.filter((s) => s !== 1), 1]);
    setCurrentStep(2);

    // TODO: Send data to Supabase here
    console.log("Data to send to Supabase:", {
      vendeg_uuid: uuid,
      vendeg_id: id,
      vendeg_first_name: dataToUse.firstName,
      vendeg_last_name: dataToUse.lastName,
      vendeg_birthday: `${dataToUse.birthYear}-${dataToUse.birthMonth}-${dataToUse.birthDay.padStart(2, "0")}`,
      vendeg_email: dataToUse.email,
      vendeg_telefon: dataToUse.phone,
      payment_status: false,
    });
  }, [formData]);

  const handlePaymentSuccess = useCallback(() => {
    // Mark step 2 as completed and move to step 3
    setCompletedSteps((prev) => [...prev.filter((s) => s !== 2), 2]);
    setCurrentStep(3);

    const now = new Date();
    const paymentDate = now.toISOString();
    const membershipStart = now.toISOString().split("T")[0];
    const membershipEnd = new Date(now.setFullYear(now.getFullYear() + 1))
      .toISOString()
      .split("T")[0];

    // TODO: Update Supabase with payment info
    console.log("Payment data to update in Supabase:", {
      vendeg_uuid: vendegUuid,
      payment_date: paymentDate,
      payment_status: true,
      membership_start: membershipStart,
      membership_end: membershipEnd,
    });
  }, [vendegUuid]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1PersonalData
            formData={formData}
            onFormChange={handleFormChange}
            onNext={handleStep1Complete}
          />
        );
      case 2:
        return <Step2Payment onPaymentSuccess={handlePaymentSuccess} />;
      case 3:
        return <Step3Summary vendegId={vendegId} />;
      default:
        return null;
    }
  };

  return (
    <div className="form-card w-full max-w-md mx-auto overflow-hidden" style={{ height: "720px" }}>
      {/* Step Indicator */}
      <StepIndicator
        steps={FORM_STEPS}
        currentStep={currentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />

      {/* Divider */}
      <div className="border-t border-border mx-6" />

      {/* Form Content */}
      <div className="px-6 py-5 h-[calc(100%-110px)]">
        {renderCurrentStep()}
      </div>
    </div>
  );
};
