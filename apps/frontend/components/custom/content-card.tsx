import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface ContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  content?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

const ContentCard = React.forwardRef<HTMLDivElement, ContentCardProps>(
  ({ 
    className, 
    title = "Sample Content",
    description = "This is a sample content card",
    content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    showButton = true,
    buttonText = "Learn More",
    onButtonClick,
    ...props 
  }, ref) => {
    return (
      <Card ref={ref} className={cn("shadow-custom hover:shadow-lg transition-shadow", className)} {...props}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{content}</p>
          {showButton && (
            <Button variant="outline" onClick={onButtonClick}>
              {buttonText}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
);
ContentCard.displayName = "ContentCard";

export { ContentCard };
