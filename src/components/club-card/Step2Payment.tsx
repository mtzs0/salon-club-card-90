import { Button } from "@/components/ui/button";

interface Step2PaymentProps {
  onPaymentSuccess: () => void;
}

export const Step2Payment = ({ onPaymentSuccess }: Step2PaymentProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center justify-center h-full px-4">
      {/* Loading Spinner */}
      <div className="loading-spinner mb-8" />

      {/* Title */}
      <h2 className="text-2xl font-display font-semibold text-foreground mb-3 text-center">
        Fizetés folyamatban
      </h2>

      {/* Subtitle */}
      <p className="text-muted-foreground text-center mb-8">
        Kérjük kövesse a lépéseket az új ablakban.
      </p>

      {/* Divider */}
      <div className="w-full max-w-xs border-t border-border my-4" />

      {/* Test Button Section */}
      <p className="text-sm text-muted-foreground mb-3">Teszteléshez:</p>
      <Button
        variant="outline"
        onClick={onPaymentSuccess}
        className="border-secondary hover:bg-secondary/20 text-foreground font-medium"
      >
        Fizetés szimulálása
      </Button>
    </div>
  );
};
