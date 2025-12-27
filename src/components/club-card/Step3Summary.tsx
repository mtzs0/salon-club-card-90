import { QRCodeSVG } from "qrcode.react";

interface Step3SummaryProps {
  vendegId: string;
}

export const Step3Summary = ({ vendegId }: Step3SummaryProps) => {
  return (
    <div className="animate-fade-in flex flex-col items-center h-full px-2 py-2">
      {/* Success Title */}
      <h2 className="text-2xl font-display font-semibold text-foreground mb-5 text-center">
        Sikeres regisztráció!
      </h2>

      {/* QR Code */}
      <div className="bg-card p-4 rounded-lg shadow-soft border border-border mb-4">
        <QRCodeSVG
          value={vendegId}
          size={140}
          level="H"
          includeMargin={false}
          bgColor="transparent"
          fgColor="hsl(0, 0%, 10%)"
        />
      </div>

      {/* ID Display */}
      <div className="bg-secondary/50 rounded-lg px-6 py-3 mb-5">
        <p className="text-xs text-muted-foreground text-center mb-1">
          Azonosító
        </p>
        <p className="text-lg font-bold text-foreground text-center tracking-wide font-body">
          {vendegId}
        </p>
      </div>

      {/* Info Text */}
      <div className="scrollable-content max-h-[180px] text-center space-y-4 px-2">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Klubtagságodhoz használható azonosítód és QR kódod emailben is elküldjük neked, kérjük ezeket mentsd le. Ha legközelebb nálunk jársz elég bemutatnod a kódot, hogy aktiváld klubtagságod.
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Amennyiben nem érkezne meg az email ellenőrizd a spam mappát vagy jelezd felénk az{" "}
          <a
            href="mailto:info@goldhair.hu"
            className="text-primary hover:text-gold-dark underline transition-colors font-medium"
          >
            info@goldhair.hu
          </a>{" "}
          email címen.
        </p>
      </div>
    </div>
  );
};
