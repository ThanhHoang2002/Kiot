import { FieldError } from "react-hook-form";


import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";

export interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    error?: FieldError;
    disabled?: boolean;
    registration: Record<string, unknown>;
  }
export const FormField = ({
  id,
  label,
  type = "text",
  placeholder,
  error,
  disabled,
  registration
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn("h-12", error && "border-red-500")}
        disabled={disabled}
        {...registration}
      />
      {error && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  );
}; 