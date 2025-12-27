import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HUNGARIAN_MONTHS = [
  { value: "01", label: "Január" },
  { value: "02", label: "Február" },
  { value: "03", label: "Március" },
  { value: "04", label: "Április" },
  { value: "05", label: "Május" },
  { value: "06", label: "Június" },
  { value: "07", label: "Július" },
  { value: "08", label: "Augusztus" },
  { value: "09", label: "Szeptember" },
  { value: "10", label: "Október" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export interface PersonalDataForm {
  firstName: string;
  lastName: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  email: string;
  phone: string;
  acceptedPrivacy: boolean;
}

interface Step1PersonalDataProps {
  formData: PersonalDataForm;
  onFormChange: (data: PersonalDataForm) => void;
  onNext: (overrideData?: PersonalDataForm) => void;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  email?: string;
  phone?: string;
  acceptedPrivacy?: string;
}

export const Step1PersonalData = ({
  formData,
  onFormChange,
  onNext,
}: Step1PersonalDataProps) => {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidChars = /[<>()[\]\\,;:\s"]/;
    return emailRegex.test(email) && !invalidChars.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, "");
    return /^\+36\d{9}$/.test(cleanPhone);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "A keresztnév megadása kötelező";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "A vezetéknév megadása kötelező";
    }

    const year = parseInt(formData.birthYear);
    if (!formData.birthYear || year < 1900 || year > new Date().getFullYear()) {
      newErrors.birthYear = "Érvénytelen év";
    }

    if (!formData.birthMonth) {
      newErrors.birthMonth = "Válasszon hónapot";
    }

    const day = parseInt(formData.birthDay);
    if (!formData.birthDay || day < 1 || day > 31) {
      newErrors.birthDay = "Érvénytelen nap";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Az email cím megadása kötelező";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Érvénytelen email cím formátum";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "A telefonszám megadása kötelező";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Érvénytelen telefonszám (formátum: +36 XX XXX XXXX)";
    }

    if (!formData.acceptedPrivacy) {
      newErrors.acceptedPrivacy = "Az adatkezelési tájékoztató elfogadása kötelező";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleSimulate = () => {
    const testData: PersonalDataForm = {
      firstName: "Teszt",
      lastName: "Felhasználó",
      birthYear: "1990",
      birthMonth: "06",
      birthDay: "15",
      email: "teszt@email.com",
      phone: "+36 30 123 4567",
      acceptedPrivacy: true,
    };
    onNext(testData);
  };

  const formatPhoneNumber = (value: string): string => {
    let cleaned = value.replace(/[^\d+]/g, "");
    
    if (!cleaned.startsWith("+36")) {
      if (cleaned.startsWith("36")) {
        cleaned = "+" + cleaned;
      } else if (cleaned.startsWith("+")) {
        cleaned = "+36" + cleaned.slice(1).replace(/\D/g, "");
      } else {
        cleaned = "+36" + cleaned;
      }
    }

    const digits = cleaned.slice(3);
    if (digits.length <= 2) {
      return `+36 ${digits}`;
    } else if (digits.length <= 5) {
      return `+36 ${digits.slice(0, 2)} ${digits.slice(2)}`;
    } else {
      return `+36 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
    }
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onFormChange({ ...formData, phone: formatted });
  };

  return (
    <div className="animate-fade-in flex flex-col h-full">
      <h2 className="text-xl font-display font-semibold text-foreground mb-4">
        Személyes adatok
      </h2>

      <div className="flex-1 space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-sm font-medium">
              Keresztnév
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) =>
                onFormChange({ ...formData, firstName: e.target.value })
              }
              className={errors.firstName ? "border-destructive" : ""}
              placeholder="János"
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Vezetéknév
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) =>
                onFormChange({ ...formData, lastName: e.target.value })
              }
              className={errors.lastName ? "border-destructive" : ""}
              placeholder="Kovács"
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Birth Date Fields */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Születési dátum</Label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input
                type="number"
                placeholder="Év"
                min={1900}
                max={new Date().getFullYear()}
                value={formData.birthYear}
                onChange={(e) =>
                  onFormChange({ ...formData, birthYear: e.target.value })
                }
                className={errors.birthYear ? "border-destructive" : ""}
              />
              {errors.birthYear && (
                <p className="text-xs text-destructive mt-1">{errors.birthYear}</p>
              )}
            </div>
            <div>
              <Select
                value={formData.birthMonth}
                onValueChange={(value) =>
                  onFormChange({ ...formData, birthMonth: value })
                }
              >
                <SelectTrigger className={errors.birthMonth ? "border-destructive" : ""}>
                  <SelectValue placeholder="Hónap" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {HUNGARIAN_MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.birthMonth && (
                <p className="text-xs text-destructive mt-1">{errors.birthMonth}</p>
              )}
            </div>
            <div>
              <Input
                type="number"
                placeholder="Nap"
                min={1}
                max={31}
                value={formData.birthDay}
                onChange={(e) =>
                  onFormChange({ ...formData, birthDay: e.target.value })
                }
                className={errors.birthDay ? "border-destructive" : ""}
              />
              {errors.birthDay && (
                <p className="text-xs text-destructive mt-1">{errors.birthDay}</p>
              )}
            </div>
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            Email cím
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              onFormChange({ ...formData, email: e.target.value })
            }
            className={errors.email ? "border-destructive" : ""}
            placeholder="pelda@email.com"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Phone Field */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm font-medium">
            Telefonszám
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={errors.phone ? "border-destructive" : ""}
            placeholder="+36 20 123 4567"
          />
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone}</p>
          )}
        </div>

        {/* Privacy Checkbox */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={formData.acceptedPrivacy}
              onCheckedChange={(checked) =>
                onFormChange({ ...formData, acceptedPrivacy: checked as boolean })
              }
              className="mt-0.5"
            />
            <Label
              htmlFor="privacy"
              className="text-sm font-normal leading-relaxed cursor-pointer"
            >
              Tudomásul veszem és elfogadom az Adatkezelési tájékoztatót.
            </Label>
          </div>
          {errors.acceptedPrivacy && (
            <p className="text-xs text-destructive pl-8">{errors.acceptedPrivacy}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-4 space-y-2">
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-gold-dark text-primary-foreground font-medium py-3"
          size="lg"
        >
          Fizetés
        </Button>
        <Button
          onClick={handleSimulate}
          variant="outline"
          className="w-full border-secondary text-foreground hover:bg-secondary/20"
        >
          Szimulálás
        </Button>
      </div>
    </div>
  );
};
