import { Zap } from "lucide-react";

interface VerifiedBadgeProps {
  size?: number; // outer circle size
}

export default function VerifiedBadge({ size = 24 }: VerifiedBadgeProps) {
  const iconSize = size * 0.6; // adjust so Zap fits nicely
  return (
    <div
      className="flex items-center justify-center rounded-full border-2 border-[#161b22]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: "linear-gradient(to bottom right, #00ffff, #0ea5e9)",
      }}
    >
      <Zap
        className="text-[#0d1117]"
        fill="currentColor"
        style={{ width: `${iconSize}px`, height: `${iconSize}px` }}
      />
    </div>
  );
}
