import React from "react";

interface CustomRadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomRadio: React.FC<CustomRadioProps> = ({ checked, onChange, ...props }) => (
    <label className="custom-radio-container">
        <input type="radio" checked={checked} onChange={onChange} {...props} />
        <div className="custom-radio-checkmark"></div>
    </label>
);
