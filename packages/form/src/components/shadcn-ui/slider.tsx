import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils/shadcn-ui/utils";

export type TipProps = React.HTMLAttributes<HTMLSpanElement> & {
  children?: React.ReactNode | ((value: number) => React.ReactNode);
};

export type ThumbProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Thumb
> & {
  showValue?: boolean;
  tipProps?: TipProps;
};

export type SliderProps = React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbProps?: ThumbProps;
};

/**
 * Accessible slider component built on top of Radix UI Slider.
 *
 * Supports:
 * - Single value sliders
 * - Range sliders with multiple thumbs
 * - Controlled and uncontrolled usage
 * - Horizontal and vertical orientations
 *
 * @example
 * Single value
 * ```tsx
 * <Slider defaultValue={[50]} max={100} step={1} />
 * ```
 *
 * @example
 * Range slider
 * ```tsx
 * <Slider defaultValue={[20, 80]} min={0} max={100} />
 * ```
 *
 * @example
 * Controlled slider
 * ```tsx
 * const [value, setValue] = React.useState([40]);
 *
 * <Slider value={value} onValueChange={setValue} />
 * ```
 */
export function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  thumbProps,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  const { showValue, tipProps, ...restThumbProps } = thumbProps ?? {};
  const {
    children: tipChildren,
    className: tipClassName,
    ...restTipProps
  } = tipProps ?? {};

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation="vertical"]:h-full data-[orientation="vertical"]:min-h-40 data-[orientation="vertical"]:w-auto data-[orientation="vertical"]:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className='relative grow overflow-hidden rounded-full bg-muted data-[orientation="horizontal"]:h-1 data-[orientation="horizontal"]:w-full data-[orientation="vertical"]:h-full data-[orientation="vertical"]:w-1'
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className='absolute bg-primary select-none data-[orientation="horizontal"]:h-full data-[orientation="vertical"]:w-full'
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="relative block size-[14px] shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-[3px] focus-visible:ring-[3px] focus-visible:outline-none active:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
          {...restThumbProps}
        >
          {showValue && (
            <span
              className={cn(
                "absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-xs text-white select-none pointer-events-none",
                tipClassName
              )}
              {...restTipProps}
            >
              {typeof tipChildren === "function"
                ? tipChildren(_values[index] as number)
                : (tipChildren ?? _values[index])}
            </span>
          )}
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}
