import * as React from "react";
import { useBreakpoint } from "./use-breakpoint";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

// Legacy hook for backward compatibility
export function useIsMobileLegacy() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
