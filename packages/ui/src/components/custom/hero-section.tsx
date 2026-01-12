import * as React from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  badges?: string[]
  showButton?: boolean
  buttonText?: string
  onButtonClick?: () => void
}

const HeroSection = React.forwardRef<HTMLElement, HeroSectionProps>(
  ({ 
    className, 
    title = "Hello World!", 
    description = "This is a beautiful hero section built with our design system.",
    badges = ["React", "TypeScript", "Tailwind"],
    showButton = true,
    buttonText = "Get Started",
    onButtonClick,
    ...props 
  }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("spacing-section min-h-[60vh] flex items-center justify-center", className)}
        {...props}
      >
        <div className="container mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gradient">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {badges.map((badge, index) => (
              <Badge key={index} variant="secondary">
                {badge}
              </Badge>
            ))}
          </div>
          
          {showButton && (
            <div className="pt-4">
              <Button size="lg" onClick={onButtonClick}>
                {buttonText}
              </Button>
            </div>
          )}
        </div>
      </section>
    )
  }
)
HeroSection.displayName = "HeroSection"

export { HeroSection }
