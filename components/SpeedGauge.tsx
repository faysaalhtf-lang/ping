import React from 'react';

interface SpeedGaugeProps {
  speed: number;
  testLabel: string;
}

const MAX_SPEED = 1000; // Max speed in Mbps for gauge scaling
const MAX_ANGLE = 135; // Max rotation angle for the needle (from -135 to 135, total 270 deg)

const SpeedGauge: React.FC<SpeedGaugeProps> = ({ speed, testLabel }) => {
  /**
   * Calculates the rotation angle for the speedometer needle.
   * A logarithmic scale is used to provide better visual feedback for lower speeds,
   * making the initial ramp-up more noticeable.
   * @param currentSpeed The current speed in Mbps.
   * @returns The angle in degrees for the CSS transform.
   */
  const getRotation = (currentSpeed: number) => {
    // Using log10(speed + 1) prevents Math.log10(0) which is -Infinity.
    const logSpeed = Math.log10(currentSpeed + 1);
    const logMaxSpeed = Math.log10(MAX_SPEED + 1);
    const percentage = logSpeed / logMaxSpeed;
    // Map the 0-1 percentage to the gauge's angle range [-135, 135].
    const angle = percentage * 270 - 135;
    return Math.min(Math.max(angle, -MAX_ANGLE), MAX_ANGLE);
  };

  const rotation = getRotation(speed);
  
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
             <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
             <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>
        </defs>

        {/* Background Arc */}
        <path
          d="M 30 150 A 70 70 0 1 1 170 150"
          fill="none"
          className="stroke-gray-200 dark:stroke-[#1f1f2b]"
          strokeWidth="20"
          strokeLinecap="round"
        />

        {/* Foreground Arc */}
        <path
          d="M 30 150 A 70 70 0 1 1 170 150"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="314"
          strokeDashoffset={314 * (1 - Math.min(speed / MAX_SPEED, 1))}
          className="transition-all duration-500 ease-out"
          filter="url(#glow)"
        />
        
        {/* Needle */}
        <g transform={`rotate(${rotation} 100 150)`} style={{ transition: 'transform 0.5s ease-out' }}>
            <path d="M 100 60 L 97 150 L 103 150 Z" className="fill-gray-800 dark:fill-white" />
            <circle cx="100" cy="150" r="8" className="fill-gray-800 dark:fill-white" />
        </g>
      </svg>
      {/* Live region for accessibility: announces speed changes to screen readers */}
      <div 
        aria-live="polite" 
        aria-atomic="true"
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-12"
      >
        <span className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-tighter" style={{ textShadow: '0 0 10px rgba(255, 255, 255, 0.3)'}}>{speed.toFixed(1)}</span>
        <span className="text-lg text-gray-500 dark:text-gray-400 font-medium">{testLabel}</span>
      </div>
    </div>
  );
};

export default SpeedGauge;