import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from 'react-hook-form';
import Select, { SelectOption } from './select';
import React from 'react';
import { getNestedErrorMessage } from '../utils/helpers/form.helpers';

/**
 * Props for the `FormSelect` component with type-safe form integration
 */
export type FormSelectProps<
  TFieldValues extends FieldValues,
  T extends string = string,
> = {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;
  /** The name of the field (type-safe, must match form schema) */
  name: Path<TFieldValues>;
  /** Default value of the select (type-safe based on field) */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
  /** Select options */
  options: SelectOption<T>[];
  /** Enable multiple selection */
  multiple?: boolean;
} & Omit<
  React.ComponentProps<typeof Select>,
  'value' | 'onChange' | 'control' | 'options'
>;

/**
 * A form select component that adds type-safe form functionality to the base Select component.
 * Designed to integrate with React Hook Form with full TypeScript support.
 *
 * @component
 * @example
 * ```tsx
 * type FormData = {
 *   country: string;
 *   hobbies: string[];
 * };
 *
 * const { control } = useForm<FormData>();
 *
 * // Single select
 * <FormSelect
 *   control={control}
 *   name="country"
 *   options={countryOptions}
 *   label="Country"
 *   placeholder="Select a country"
 *   required
 * />
 *
 * // Multiple select
 * <FormSelect
 *   control={control}
 *   name="hobbies"
 *   options={hobbyOptions}
 *   label="Hobbies"
 *   placeholder="Select hobbies"
 *   multiple
 *   required
 * />
 * ```
 */
export default function FormSelect<
  TFieldValues extends FieldValues,
  T extends string = string,
>({
  control,
  name,
  defaultValue,
  required = true,
  multiple = false,
  options,
  ...props
}: FormSelectProps<TFieldValues, T>) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={defaultValue}
      rules={{ required: required ? 'Required' : false }}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <Select
          triggerProps={{ id: `form-select-${name}` }}
          value={value ?? (multiple ? [] : '')}
          onChange={onChange}
          required={required}
          multiple={multiple}
          options={options}
          error={getNestedErrorMessage(errors || {}, name) as string}
          {...props}
        />
      )}
    />
  );
}

