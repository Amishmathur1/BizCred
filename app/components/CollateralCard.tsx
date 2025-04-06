import React, { useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

interface CollateralProps {
  companyName: string;
  companyDescription: string;
  loan: string;
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const Collateral: React.FC<CollateralProps> = ({
  companyName,
  companyDescription,
  loan,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.25)",
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(0.6);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(0.6);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8 ${className}`}
    >
      {/* Spotlight Effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />

      {/* Card Content */}
      <div className="flex flex-col gap-4 items-start justify-between h-full">
        <h3 className="text-white text-xl font-semibold mb-2">{companyName}</h3>
        <p className="text-neutral-300">{companyDescription}</p>
        <p className="text-lg font-medium text-green-400">{loan}</p>
        <button className="mt-auto bg-white hover:bg-black text-black hover:text-white transition duration-300 px-4 py-2 rounded-lg font-medium">
          Repay Loan
        </button>
      </div>
    </div>
  );
};

export default Collateral;
