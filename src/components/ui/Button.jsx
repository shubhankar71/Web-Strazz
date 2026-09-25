import { forwardRef } from "react";
import "./Button.css";

/**
 * variant: "primary" | "secondary" | "ghost" | "danger"
 * size: "sm" | "md"
 */
const Button = forwardRef(function Button({
  children,
  variant = "secondary",
  size = "md",
  icon: Icon,
  as = "button",
  className = "",
  ...rest
}, ref) {
  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={`ws-btn ws-btn--${variant} ws-btn--${size} ${className}`.trim()}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 15} strokeWidth={2} aria-hidden="true" />}
      {children}
    </Tag>
  );
});

export default Button;
