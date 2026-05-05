import {
  Controller,
  Control,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import Switch, { SwitchProps } from "./switch";
import { getNestedErrorMessage } from "../utils/helpers/form.helpers";

/**
 * Props for the `FormSwitch` component with type-safe form integration.
 */
export type FormSwitchProps<TFieldValues extends FieldValues> = {
  /** React Hook Form control instance */
  control: Control<TFieldValues>;
  /** The name of the field (type-safe, must match form schema) */
  name: Path<TFieldValues>;
  /** Default value of the switch */
  defaultValue?: PathValue<TFieldValues, Path<TFieldValues>>;
} & Omit<SwitchProps, "checked" | "onCheckedChange">;

/**
 * A form switch component that adds type-safe form functionality to Switch.
 * Designed to integrate with React Hook Form with full TypeScript support.
 *
 * @component
 * @example
 * ```tsx
 * type FormData = {
 *   notifications: boolean;
 *   darkMode: boolean;
 * };
 *
 * const { control } = useForm<FormData>();
 *
 * <FormSwitch
 *   control={control}
 *   name="notifications"
 *   label="Enable notifications"
 *   required
 * />
 *
 * <FormSwitch
 *   control={control}
 *   name="darkMode"
 *   label="Dark mode"
 *   labelPosition="start"
 *   size="sm"
 * />
 * ```
 */
export default function FormSwitch<TFieldValues extends FieldValues>({
  control,
  name,
  defaultValue,
  required = false,
  ...props
}: FormSwitchProps<TFieldValues>) {
  return (
    <div className="w-full">
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        rules={{ required: required ? "Required" : false }}
        render={({ field: { onChange, value }, formState: { errors } }) => (
          <Switch
            switchProps={{ id: `form-switch-${name}` }}
            checked={!!value}
            onCheckedChange={onChange}
            required={required}
            error={getNestedErrorMessage(errors || {}, name) as string}
            {...props}
          />
        )}
      />
    </div>
  );
}
