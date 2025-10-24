import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Input from "../input";
import React from "react";

/**
 * Props for the `FormInput` component with type-safe form integration
 */
export type FormInputProps<TFieldValues extends FieldValues> = {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;
  /** The name of the field (type-safe, must match form schema) */
  name: Path<TFieldValues>;
  /** Default value of the input (type-safe based on field) */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
} & Omit<
  React.ComponentProps<typeof Input>,
  "value" | "onChange" | "error" | "control"
>;

/**
 * A form input component that adds type-safe form functionality to the base Input component.
 * Designed to integrate with React Hook Form with full TypeScript support.
 *
 * @component
 * @example
 * ```tsx
 * type FormData = {
 *   email: string;
 *   age: number;
 * };
 *
 * const { control } = useForm<FormData>();
 *
 * <FormInput
 *   control={control}
 *   name="email" // ✅ Type-safe: only "email" or "age" allowed
 *   defaultValue="test@example.com" // ✅ Type-safe: must be string
 *   label="Email"
 *   placeholder="Enter your email"
 *   required
 *   tip="Enter a valid email address"
 * />
 * ```
 */
export default function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  defaultValue,
  required = true,
  ...props
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required: required ? "Required" : false }}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Input
          id={`form-input-${name}`}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          error={error?.message}
          {...props}
        />
      )}
    />
  );
}
