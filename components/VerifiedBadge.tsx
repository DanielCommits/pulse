import { Zap } from "lucide-react"; // assuming you’re using lucide-react

interface VerifiedBadgeProps {
  size?: number; // optional size
}

export default function VerifiedBadge({ size = 20 }: VerifiedBadgeProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border-2 border-[#161b22]`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "linear-gradient(135deg, #00ffff 0%, #0ea5e9 100%)",
      }}
    >
      <Zap className="text-[#0d1117]" style={{ width: size * 0.6, height: size * 0.6 }} />
    </div>
  );
}
