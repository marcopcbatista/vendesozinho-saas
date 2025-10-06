import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
}

