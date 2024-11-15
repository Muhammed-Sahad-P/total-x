import React from 'react';

interface InputProps {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string | boolean | null;
    name: string;
    maxLength?: number;
}

const Input: React.FC<InputProps> = ({
    label,
    type,
    placeholder,
    value,
    onChange,
    error,
    name,
}) => {
    return (
        <div className="relative mb-4">
            <label
                htmlFor={name}
                className="absolute -top-2 left-2 bg-white px-2 text-xs text-black"
            >
                {label}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`peer mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins focus:border-indigo-500 sm:text-sm bg-white ${error ? 'border-red-500' : 'border-black'}`}
            />

            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default Input;
