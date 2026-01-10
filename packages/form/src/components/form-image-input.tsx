import { Control, Controller, FieldValues, Path } from "react-hook-form";
import ImageInput, { ImageInputProps } from "./image-input";
import { getNestedErrorMessage } from "../utils/helpers/form.helpers";

export type FormImageInputProps<TFieldValues extends FieldValues> = Omit<
  ImageInputProps,
  "value" | "onChange" | "onError" | "error"
> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
};

export default function FormImageInput<TFieldValues extends FieldValues>({
  control,
  name,
  ...props
}: FormImageInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: props.required ? "Required" : false,
      }}
      render={({ field: { onChange, value }, formState: { errors } }) => (
        <ImageInput
          {...props}
          name={name}
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
