
import * as React from "react"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  helperText?: string;
  autoGrow?: boolean;
  maxHeight?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, helperText, autoGrow, maxHeight = 300, onChange, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const mergedRef = React.useMemo(() => {
      return (node: HTMLTextAreaElement) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      };
    }, [ref]);

    const resizeTextarea = React.useCallback(() => {
      if (autoGrow && textareaRef.current) {
        // Reset height to auto to get the correct scrollHeight
        textareaRef.current.style.height = 'auto';
        
        // Set the height to the scrollHeight (content height)
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = 
          `${Math.min(scrollHeight, maxHeight)}px`;
        
        // If content exceeds maxHeight, enable scrolling
        textareaRef.current.style.overflowY = 
          scrollHeight > maxHeight ? 'auto' : 'hidden';
      }
    }, [autoGrow, maxHeight]);

    React.useEffect(() => {
      if (autoGrow) {
        resizeTextarea();
        
        // Add resize event listener to handle window resizing
        window.addEventListener('resize', resizeTextarea);
        return () => {
          window.removeEventListener('resize', resizeTextarea);
        };
      }
    }, [autoGrow, resizeTextarea]);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      
      if (autoGrow) {
        // Slight delay ensures content is updated before resizing
        setTimeout(resizeTextarea, 0);
      }
    }, [onChange, autoGrow, resizeTextarea]);

    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          ref={mergedRef}
          onChange={handleChange}
          {...props}
        />
        
        {(error || helperText) && (
          <div className={cn(
            "text-xs mt-1", 
            error ? "text-destructive" : "text-muted-foreground"
          )}>
            {error || helperText}
          </div>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
