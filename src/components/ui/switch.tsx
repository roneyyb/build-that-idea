import * as React from "react";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, checked, onChange, disabled, className, ...props }, ref) => {
    // CSS-in-JS styles for the switch
    const styles: { [key: string]: React.CSSProperties } = {
      switch: {
        // switch
        '--switch-width': '46px',
        '--switch-height': '24px',
        '--switch-bg': 'rgb(131, 131, 131)',
        '--switch-checked-bg': 'rgb(0, 218, 80)',
        '--circle-diameter': '18px',
        '--circle-bg': '#fff',
        '--circle-shadow': '1px 1px 2px rgba(146, 146, 146, 0.45)',
        '--circle-checked-shadow': '-1px 1px 2px rgba(163, 163, 163, 0.45)',
        '--switch-transition': 'all .2s cubic-bezier(0.27, 0.2, 0.25, 1.51)',
        '--circle-transition': 'all .2s cubic-bezier(0.27, 0.2, 0.25, 1.51)',
        '--icon-transition': 'all .2s cubic-bezier(0.27, 0.2, 0.25, 1.51)',
        '--icon-cross-color': 'rgb(131, 131, 131)',
        '--icon-cross-size': '6px',
        '--icon-checkmark-color': 'rgb(0, 218, 80)',
        '--icon-checkmark-size': '10px',
        '--effect-width': '9px',
        '--effect-height': '3px',
        '--effect-bg': '#fff',
        '--effect-border-radius': '1px',
        '--effect-transition': 'all .2s ease-in-out',
        position: 'relative',
        display: 'inline-block',
        verticalAlign: 'middle',
      } as React.CSSProperties,
      input: {
        display: 'none',
      },
      slider: {
        boxSizing: 'border-box',
        width: 'var(--switch-width)',
        height: 'var(--switch-height)',
        background: checked ? 'var(--switch-checked-bg)' : 'var(--switch-bg)',
        borderRadius: '999px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        transition: 'var(--switch-transition)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      } as React.CSSProperties,
      circle: {
        width: 'var(--circle-diameter)',
        height: 'var(--circle-diameter)',
        background: 'var(--circle-bg)',
        borderRadius: '999px',
        boxShadow: checked ? 'var(--circle-checked-shadow)' : 'var(--circle-shadow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'var(--circle-transition)',
        zIndex: 1,
        position: 'absolute',
        left: checked
          ? 'calc(100% - var(--circle-diameter) - ((var(--switch-height) - var(--circle-diameter)) / 2))'
          : 'calc((var(--switch-height) - var(--circle-diameter)) / 2)',
      } as React.CSSProperties,
      effect: {
        content: '""',
        position: 'absolute',
        width: 'var(--effect-width)',
        height: 'var(--effect-height)',
        left: checked
          ? 'calc(100% - var(--effect-width) - (var(--effect-width) / 2) - ((var(--switch-height) - var(--circle-diameter)) / 2))'
          : 'calc(((var(--switch-height) - var(--circle-diameter)) / 2) + (var(--effect-width) / 2))',
        background: 'var(--effect-bg)',
        borderRadius: 'var(--effect-border-radius)',
        transition: 'var(--effect-transition)',
        top: '50%',
        transform: 'translateY(-50%)',
      } as React.CSSProperties,
      checkmark: {
        width: 'var(--icon-checkmark-size)',
        color: 'var(--icon-checkmark-color)',
        transform: checked ? 'scale(1)' : 'scale(0)',
        transition: 'var(--icon-transition)',
        position: 'absolute',
      } as React.CSSProperties,
      cross: {
        width: 'var(--icon-cross-size)',
        color: 'var(--icon-cross-color)',
        transform: checked ? 'scale(0)' : 'scale(1)',
        transition: 'var(--icon-transition)',
        position: 'absolute',
      } as React.CSSProperties,
      label: {
        marginLeft: 10,
        fontSize: 14,
        userSelect: 'none',
      },
    };

    return (
      <label style={styles.switch} className={className}>
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={styles.input}
          {...props}
        />
        <div style={styles.slider} className="slider">
          {/* Effect line */}
          <span style={styles.effect}></span>
          <div style={styles.circle} className="circle">
            {/* Cross icon (X) */}
            <svg
              className="cross"
              style={styles.cross}
              viewBox="0 0 365.696 365.696"
              width={6}
              height={6}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M243.188 182.86 356.32 69.726c12.5-12.5 12.5-32.766 0-45.247L341.238 9.398c-12.504-12.503-32.77-12.503-45.25 0L182.86 122.528 69.727 9.374c-12.5-12.5-32.766-12.5-45.247 0L9.375 24.457c-12.5 12.504-12.5 32.77 0 45.25l113.152 113.152L9.398 295.99c-12.503 12.503-12.503 32.769 0 45.25L24.48 356.32c12.5 12.5 32.766 12.5 45.247 0l113.132-113.132L295.99 356.32c12.503 12.5 32.769 12.5 45.25 0l15.081-15.082c12.5-12.504 12.5-32.77 0-45.25zm0 0"
                />
              </g>
            </svg>
            {/* Checkmark icon */}
            <svg
              className="checkmark"
              style={styles.checkmark}
              viewBox="0 0 24 24"
              width={10}
              height={10}
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  fill="currentColor"
                  d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"
                />
              </g>
            </svg>
          </div>
        </div>
        {label && <span style={styles.label}>{label}</span>}
      </label>
    );
  }
);

Switch.displayName = "Switch";
