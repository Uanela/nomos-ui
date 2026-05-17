import * as React from "react";
import { twMerge } from "tailwind-merge";
import { AsteriskIcon } from "lucide-react";
import {
  Slider as ShadcnSlider,
  SliderProps as ShadcnSliderProps,
} from "./shadcn-ui/slider";

export type SliderProps = {
  className?: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  labelProps?: React.ComponentProps<"label">;
  sliderProps?: Omit<
    ShadcnSliderProps,
    "value" | "defaultValue" | "onValueChange"
  >;
  labelPosition?: "start" | "end";
  error?: string;
  tip?: string;
  disabled?: boolean;
  rate?: number;
};

export default function Slider({
  className,
  label,
  required = false,
  showRequiredSign = false,
  value,
  defaultValue,
  onValueChange,
  labelProps,
  sliderProps,
  labelPosition = "start",
  error,
  tip,
  disabled,
  rate = 1,
}: SliderProps) {
  const max = sliderProps?.max ?? 100;
  const min = sliderProps?.min ?? 0;
  const step = sliderProps?.step ?? 1;
  const range = max - min;

  const toPos = (v: number) =>
    rate === 1 ? v : min + range * Math.pow((v - min) / range, 1 / rate);

  const toValue = (pos: number) =>
    rate === 1 ? pos : min + range * Math.pow((pos - min) / range, rate);

  const snapToStep = (v: number) => Math.round((v - min) / step) * step + min;

  const { thumbProps, ...restSliderProps } = sliderProps ?? {};
  const { tipProps, ...restThumbProps } = thumbProps ?? {};
  const { children: tipChildren, ...restTipProps } = tipProps ?? {};

  const patchedTipChildren =
    typeof tipChildren === "function"
      ? (pos: number) => tipChildren(snapToStep(Math.round(toValue(pos))))
      : tipChildren;

  const patchedThumbProps = {
    ...restThumbProps,
    ...(tipProps !== undefined
      ? {
          tipProps: {
            ...restTipProps,
            children: patchedTipChildren,
          },
        }
      : {}),
  };

  const sliderId =
    sliderProps?.id ??
    (label ? `slider-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

  const sliderEl = (
    <ShadcnSlider
      {...restSliderProps}
      step={undefined}
      id={sliderId}
      value={value?.map(toPos)}
      defaultValue={defaultValue?.map(toPos)}
      onValueChange={(pos) =>
        onValueChange?.(pos.map((p) => snapToStep(Math.round(toValue(p)))))
      }
      thumbProps={patchedThumbProps}
      disabled={disabled}
      aria-invalid={!!error}
    />
  );

  const labelEl = label ? (
    <div className="flex flex-row items-center gap-1">
      <label
        {...labelProps}
        htmlFor={labelProps?.htmlFor ?? sliderId}
        className={twMerge(
          "font-bold",
          disabled && "opacity-50 cursor-not-allowed",
          labelProps?.className
        )}
      >
        {label}
      </label>
      {required && showRequiredSign && <AsteriskIcon size={12} color="red" />}
    </div>
  ) : null;

  return (
    <div className={twMerge("grid gap-1 w-full", className)}>
      {labelPosition === "start" && labelEl}
      {sliderEl}
      {labelPosition === "end" && labelEl}
      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}
      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
