import { CheckIcon } from "lucide-react";
import React from "react";

interface CustomCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, ...props }) => (
    <label className="custom-checkbox-container">
        <input type="checkbox" checked={checked} onChange={onChange} {...props} />
        <div className="checkmark">
            {checked && (
                <CheckIcon size={18} />
            )}
        </div>
    </label>
);
