/**
 * CustomButton Component
 * 
 * Yeniden kullanılabilir buton component'i. Farklı variant'lar (default, success, danger),
 * icon desteği, loading state ve form submission desteği sağlar.
 */

import "./CustomButton.scss";

function CustomButton({
  label,
  onClick = null,
  disabled = false,
  variant = "default", // "default", "success", "danger"
  icon = null, // React icon component
  type = null, // "button", "submit", "reset" - if provided, renders as button element
  loading = false, // External loading state
}) {
  const handleClick = () => {
    if (disabled || loading || !onClick) return;
    onClick();
  };

  const className = `custom-button custom-button--${variant} ${loading ? 'loading' : ''} ${disabled ? 'disabled' : ''}`;
  const content = (
    <>
      {icon && <span className="custom-button__icon">{icon}</span>}
      {label}
    </>
  );

  // If type is provided, render as button element (for form submission)
  if (type) {
    return (
      <button
        type={type}
        className={className}
        onClick={type === "submit" ? undefined : handleClick}
        disabled={disabled || loading}
      >
        {content}
      </button>
    );
  }

  // Otherwise render as div (default behavior)
  return (
    <div 
      className={className}
      onClick={handleClick}
    >
      {content}
    </div>
  );
}

export default CustomButton;
