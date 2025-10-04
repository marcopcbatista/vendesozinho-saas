import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}
