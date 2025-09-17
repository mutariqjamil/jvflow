export const LoadingSpinner = () => {
  return (
    <div className="size-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-8 h-8 border-2 border-primary/40 border-t-transparent rounded-full animate-spin mx-auto mt-2"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-medium">Loading JV-Flow</p>
          <p className="text-sm text-muted-foreground">
            Initializing your real estate management platform...
          </p>
        </div>
      </div>
    </div>
  )
}