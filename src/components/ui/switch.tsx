import * as React from "react";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ label, ...props }, ref) => (
  <label style={{ display: "inline-flex", alignItems: "center", cursor: "pointer", gap: 8 }}>
    <input
      type="checkbox"
      ref={ref}
      style={{ width: 32, height: 18, accentColor: "#22c55e" }}
      {...props}
    />
    {label && <span style={{ fontSize: 14 }}>{label}</span>}
  </label>
));

Switch.displayName = "Switch";
