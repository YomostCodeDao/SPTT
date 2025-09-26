import * as React from "react";
export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={
                "w-full rounded-xl border border-neutral-800 bg-neutral-950/60 shadow-xl backdrop-blur p-6 " + className
            }
            {...props}
        />
    );
}
