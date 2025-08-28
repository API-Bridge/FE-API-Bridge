'use client';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 5, 
  className = '' 
}: ShinyTextProps) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`inline-block whitespace-nowrap relative ${className}`}
      style={{
        whiteSpace: 'nowrap',
      }}
    >
      <span className="relative z-10">{text}</span>
      <div
        className={`absolute inset-0 bg-clip-text inline-block whitespace-nowrap ${disabled ? '' : 'animate-shine'}`}
        style={{
          backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 60%)',
          backgroundSize: '200% 100%',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animationDuration: animationDuration,
          whiteSpace: 'nowrap',
          mixBlendMode: 'overlay',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export default ShinyText;