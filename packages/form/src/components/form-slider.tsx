import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Slider, { SliderProps } from "./slider";
import { getNestedErrorMessage } from "../utils/helpers/form.helpers";

/**
 * Props for the `FormSlider` component with type-safe form integration.
 */
export type FormSliderProps<TFieldValues extends FieldValues> = {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;

  /** The name of the field (type-safe, must match form schema) */
  name: Path<TFieldValues>;

  /** Default value of the slider */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
} & Omit<SliderProps, "value" | "defaultValue" | "onValueChange">;

/**
 * A form slider component that adds type-safe form functionality to Slider.
 * Designed to integrate with React Hook Form with full TypeScript support.
 *
 * @component
 * @example
 * ```tsx
 * type FormData = {
 *   volume: number[];
 *   range: number[];
 * };
 *
 * const { control } = useForm<FormData>();
 *
 * <FormSlider
 *   control={control}
 *   name="volume"
 *   label="Volume"
 *   defaultValue={[50]}
 * />
 *
 * <FormSlider
 *   control={control}
 *   name="range"
 *   label="Price range"
 *   defaultValue={[20, 80]}
 *   min={0}
 *   max={100}
 * />
 * ```
 */
export default function FormSlider<TFieldValues extends FieldValues>({
  control,
  name,
  defaultValue,
  required = false,
  ...props
}: FormSliderProps<TFieldValues>) {
  return (
    <div className="w-full">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{ required: required ? "Required" : false }}
        render={({ field: { onChange, value }, formState: { errors } }) => (
          <Slider
            sliderProps={{ id: `form-slider-${name}` }}
            value={value as number[]}
            onValueChange={onChange}
            required={required}
            error={getNestedErrorMessage(errors || {}, name) as string}
            {...props}
          />
        )}
      />
    </div>
  );
}
