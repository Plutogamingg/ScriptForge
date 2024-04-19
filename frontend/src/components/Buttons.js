// Button.jsx
const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    // Define variant-specific styles
    const baseStyle = 'py-2 px-4 rounded focus:outline-none focus:ring-2';
    const variants = {
      primary: `bg-button-blue text-white hover:bg-button-blue-hover ${baseStyle}`,
      secondary: `bg-button-gray text-white hover:bg-button-gray-hover ${baseStyle}`,
    };
  
    // Combine base, variant, and custom classes
    const buttonClass = `${variants[variant]} ${className}`;
  
    return (
      <button className={buttonClass} {...props}>
        {children}
      </button>
    );
  };
  
  export default Button;
  