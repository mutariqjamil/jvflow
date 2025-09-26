import * as React from "react";

import { cn } from "./utils";
import { useBreakpoint } from './use-breakpoint';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'mobile';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    const breakpoint = useBreakpoint();
    
    // Auto-detect mobile variant if not explicitly set
    const effectiveVariant = variant || (breakpoint === 'mobile' ? 'mobile' : 'default');
    
    const baseClasses = "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border px-3 bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";
    
    const variantClasses = {
      default: "h-9 py-1 text-base file:h-7 file:text-sm md:text-sm",
      mobile: "h-12 py-3 text-base file:h-9 file:text-base" // Mobile-friendly: 48px height, better touch target
    };

    const responsiveClasses = "sm:h-10 sm:py-2 md:text-sm"; // Responsive sizing

    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          baseClasses,
          variantClasses[effectiveVariant],
          responsiveClasses,
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        style={{
          fontSize: effectiveVariant === 'mobile' ? '16px' : undefined, // Prevents zoom on iOS
          ...props.style
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };