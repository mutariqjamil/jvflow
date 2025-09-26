import React from 'react';
import { useBreakpoint, useIsMobile, useIsTablet, useIsDesktop, useResponsiveValue } from './ui/use-breakpoint';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

/**
 * Test component to verify the breakpoint system functionality
 * This component displays current breakpoint and responsive values
 */
export function BreakpointTest() {
  const breakpoint = useBreakpoint();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  
  const responsiveText = useResponsiveValue(
    'Mobile View', 
    'Tablet View', 
    'Desktop View'
  );
  
  const responsiveColor = useResponsiveValue(
    'text-red-600',   // Mobile - Red
    'text-blue-600',  // Tablet - Blue
    'text-green-600'  // Desktop - Green
  );

  const responsivePadding = useResponsiveValue(
    'p-3',  // Mobile - Small padding
    'p-4',  // Tablet - Medium padding
    'p-6'   // Desktop - Large padding
  );

  return (
    <div className={`min-h-screen bg-gray-50 flex items-center justify-center ${responsivePadding}`}>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className={responsiveColor}>
            Breakpoint System Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Current Breakpoint:</h3>
            <Badge 
              variant={breakpoint === 'mobile' ? 'default' : 'secondary'}
              className="mr-2"
            >
              {breakpoint}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <p className="font-medium">Mobile</p>
              <Badge variant={isMobile ? 'default' : 'outline'}>
                {isMobile ? '✓' : '✗'}
              </Badge>
            </div>
            <div className="text-center">
              <p className="font-medium">Tablet</p>
              <Badge variant={isTablet ? 'default' : 'outline'}>
                {isTablet ? '✓' : '✗'}
              </Badge>
            </div>
            <div className="text-center">
              <p className="font-medium">Desktop</p>
              <Badge variant={isDesktop ? 'default' : 'outline'}>
                {isDesktop ? '✓' : '✗'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Responsive Text:</h3>
            <p className={`text-lg font-medium ${responsiveColor}`}>
              {responsiveText}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Breakpoint Thresholds:</h3>
            <div className="text-xs space-y-1 text-gray-600">
              <p>• Mobile: &lt; 768px</p>
              <p>• Tablet: 768px - 1023px</p>
              <p>• Desktop: ≥ 1024px</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Instructions:</h3>
            <p className="text-xs text-gray-600">
              Resize your browser window to see the breakpoint changes in real-time. 
              The badge colors and text will update automatically.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default BreakpointTest;