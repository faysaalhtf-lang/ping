
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-8 py-3 font-bold text-lg rounded-full transition-all duration-300 focus:outline-none focus:ring-4";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-neon-blue to-neon-magenta text-white shadow-lg hover:shadow-xl hover:scale-105 focus:ring-neon-blue/50",
    secondary: "bg-gray-100 dark:bg-dark-card border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-black dark:hover:text-white focus:ring-gray-300 dark:focus:ring-white/20",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;