import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: () => void;
    width?: string;
    height?: string;
    disabled?: boolean;
    loading?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    text,
    onClick,
    width = 'w-full',
    height = 'h-12',
    disabled = false,
    loading = false,
    type = 'button'
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${width} ${height} bg-[#515DEF] text-white font-medium rounded-sm hover:bg-[#515DEF] font-poppins focus:outline-none disabled:opacity-50 flex items-center justify-center`}
        >
            {loading ? (
                <div className="flex items-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        ></path>
                    </svg>
                    Loading...
                </div>
            ) : (
                text
            )}
        </button>
    );
};

export default Button;
