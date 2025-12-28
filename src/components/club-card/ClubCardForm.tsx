import { useState, useCallback } from "react";
import { StepIndicator } from "./StepIndicator";
import { Step1PersonalData, PersonalDataForm } from "./Step1PersonalData";
import { Step2Payment } from "./Step2Payment";
import { Step3Summary } from "./Step3Summary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleStep1Complete = useCallback(async (overrideData?: PersonalDataForm) => {
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

    setIsSubmitting(true);

    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from("clients")
        .insert({
          vendeg_uuid: uuid,
          vendeg_id: id,
          vendeg_first_name: dataToUse.firstName,
          vendeg_last_name: dataToUse.lastName,
          vendeg_birthday: `${dataToUse.birthYear}-${dataToUse.birthMonth}-${dataToUse.birthDay.padStart(2, "0")}`,
          vendeg_email: dataToUse.email,
          vendeg_telefon: dataToUse.phone,
          payment_status: false,
        });

      if (error) {
        console.error("Supabase insert error:", error);
        toast.error("Hiba történt az adatok mentése során. Kérjük, próbálja újra.");
        setIsSubmitting(false);
        return;
      }

      // Mark step 1 as completed and move to step 2
      setCompletedSteps((prev) => [...prev.filter((s) => s !== 1), 1]);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Hiba történt az adatok mentése során. Kérjük, próbálja újra.");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handlePaymentSuccess = useCallback(async () => {
    const now = new Date();
    const paymentDate = now.toISOString();
    const membershipStart = now.toISOString().split("T")[0];
    const membershipEnd = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0];

    try {
      // First, check if membership_start already exists
      const { data: existingData } = await supabase
        .from("clients")
        .select("membership_start")
        .eq("vendeg_uuid", vendegUuid)
        .maybeSingle();

      const updateData: Record<string, unknown> = {
        payment_date: paymentDate,
        payment_status: true,
        membership_end: membershipEnd,
      };

      // Only set membership_start if it doesn't already exist
      if (!existingData?.membership_start) {
        updateData.membership_start = membershipStart;
      }

      const { error } = await supabase
        .from("clients")
        .update(updateData)
        .eq("vendeg_uuid", vendegUuid);

      if (error) {
        console.error("Supabase update error:", error);
        toast.error("Hiba történt a fizetés mentése során.");
        return;
      }

      // Mark step 2 as completed and move to step 3
      setCompletedSteps((prev) => [...prev.filter((s) => s !== 2), 2]);
      setCurrentStep(3);
    } catch (error) {
      console.error("Error updating payment:", error);
      toast.error("Hiba történt a fizetés mentése során.");
    }
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
