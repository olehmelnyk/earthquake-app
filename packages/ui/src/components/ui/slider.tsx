"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary dark:bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary dark:bg-primary" />
    </SliderPrimitive.Track>
    {props.defaultValue?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background dark:bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

interface RangeSliderProps {
  values?: [number, number];
  defaultValues?: [number, number];
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => string;
  onChange?: (values: [number, number]) => void;
  className?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  dir?: "ltr" | "rtl";
  inverted?: boolean;
  name?: string;
}

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ 
  className, 
  values, 
  defaultValues = [0, 100], 
  min = 0, 
  max = 100, 
  step = 1, 
  onChange,
  formatValue = (v) => v.toString(),
  disabled,
  orientation,
  dir,
  inverted,
  name,
  ...props 
}, ref) => {
  const handleValueChange = (newValues: number[]) => {
    if (onChange && newValues.length === 2) {
      onChange([newValues[0], newValues[1]]);
    }
  };
  
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      defaultValue={defaultValues}
      value={values}
      onValueChange={handleValueChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      orientation={orientation}
      dir={dir}
      inverted={inverted}
      name={name}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        aria-label="Min value"
      />
      <SliderPrimitive.Thumb 
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" 
        aria-label="Max value"
      />
    </SliderPrimitive.Root>
  );
});
RangeSlider.displayName = "RangeSlider";

export { Slider, RangeSlider }
