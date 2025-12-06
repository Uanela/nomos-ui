import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Textarea from "./textarea";
import React from "react";
import { getNestedErrorMessage } from "../utils/helpers/form.helpers";

/**
 * Props for the `FormTextarea` component with type-safe form integration
 */
export type FormTextareaProps<TFieldValues extends FieldValues> = {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;
  /** The name of the field (type-safe, must match form schema) */
  name: Path<TFieldValues>;
  /** Default value of the textarea (type-safe based on field) */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
} & Omit<
  React.ComponentProps<typeof Textarea>,
  "value" | "onChange" | "error" | "control"
>;

/**
 * A form textarea component that adds type-safe form functionality to the base Textarea component.
 * Designed to integrate with React Hook Form with full TypeScript support.
 *
 * @component
 * @example
 * ```tsx
 * type FormData = {
 *   description: string;
 *   bio: string;
 * };
 *
 * const { control } = useForm<FormData>();
 *
 * <FormTextarea
 *   control={control}
 *   name="description"
 *   defaultValue=""
 *   label="Description"
 *   placeholder="Enter description"
 *   required
 *   rows={6}
 *   maxLength={500}
 *   showCharCount
 *   tip="Provide a detailed description"
 * />
 * ```
 */
export default function FormTextarea<TFieldValues extends FieldValues>({
  control,
  name,
  defaultValue,
  required = true,
  ...props
}: FormTextareaProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required: required ? "Required" : false }}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <Textarea
          id={`form-textarea-${name}`}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          error={getNestedErrorMessage(errors || {}, name)}
          {...props}
        />
      )}
    />
  );
}
