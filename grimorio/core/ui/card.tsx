import * as React from "react"
import { cn } from "@/core/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "glass" | "magical" | "dark" | "gold";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = "default", ...props }, ref) => {
        const variants = {
            default: "rounded-xl border bg-card text-card-foreground shadow",
            glass: "rounded-xl border border-white/10 bg-black/40 backdrop-blur-md shadow-lg",
            magical: "rounded-xl border border-white/10 bg-[#1c1917]/80 backdrop-blur-sm shadow-lg hover:shadow-[0_0_20px_-5px_rgba(208,32,32,0.3)] hover:border-tormenta-red/30 transition-all duration-300",
            dark: "rounded-xl border border-white/5 bg-[#121110] text-white shadow-md",
            gold: "rounded-xl border border-tormenta-gold/50 bg-[#1c1917] shadow-[0_0_15px_rgba(255,215,0,0.1)]"
        };

        return (
            <div
                ref={ref}
                className={cn(variants[variant], className)}
                {...props}
            />
        );
    }
)
Card.displayName = "Card"

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "text-2xl font-semibold leading-none tracking-tight",
                className
            )}
            {...props}
        />
    )
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        />
    )
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("p-6 pt-0", className)} {...props} />
}

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
        />
    )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
