import { Control, Controller, FieldValues, Path } from "react-hook-form";
import FileInput, { FileInputProps } from "./file-input";
import { getNestedErrorMessage } from "../utils/helpers/form.helpers";

/**
 * Props for the `FormFileInput` component with type-safe form integration.
 *
 * Omits the props that are managed internally by React Hook Form
 * (`value`, `onChange`, `onError`, `error`) and adds the RHF-specific ones.
 */
export type FormFileInputProps<TFieldValues extends FieldValues> = Omit<
  FileInputProps,
  "value" | "onChange" | "onError" | "error"
> & {
  /** React Hook Form control instance. */
  control: Control<TFieldValues>;
  /** The name of the field (type-safe, must match the form schema). */
  name: Path<TFieldValues>;
};

/**
 * A file-upload field that integrates `FileInput` with React Hook Form.
 *
 * - Wires `value`, `onChange`, and `error` automatically via `Controller`
 * - File rejection errors (e.g. size exceeded) are forwarded to RHF via `setError`
 * - Supports the `required` rule out of the box
 *
 * @example
 * ```tsx
 * type FormData = {
 *   resume: FileInputFile[];
 * };
 *
 * const { control } = useForm<FormData>({ defaultValues: { resume: [] } });
 *
 * <FormFileInput
 *   control={control}
 *   name="resume"
 *   label="Resume"
 *   required
 *   showRequiredSign
 *   accept=".pdf,.doc,.docx"
 *   acceptLabel="PDF, DOC, DOCX"
 *   maxSize={50 * 1024 * 1024}
 *   tip="Max 50 MB per file."
 * />
 * ```
 */
export default function FormFileInput<TFieldValues extends FieldValues>({
  control,
  name,
  ...props
}: FormFileInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: props.required ? "Required" : false,
      }}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <FileInput
          {...props}
          value={value}
          onChange={onChange}
          onError={(errorMessage: string) => {
            control.setError(name, {
              type: "manual",
              message: errorMessage,
            });
          }}
          error={getNestedErrorMessage(errors, name)}
        />
      )}
    />
  );
}
