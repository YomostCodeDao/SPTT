import * as React from "react";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", ...props }, ref) => (
    <input
        ref={ref}
        className={
            "w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-neutral-100 " +
            "placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-neutral-500 " +
            className
        }
        {...props}
    />
));
Input.displayName = "Input";
