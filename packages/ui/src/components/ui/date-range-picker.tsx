"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button } from "./button"
import { Calendar } from "./calendar"
import { Input } from "./input"
import { Label } from "./label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Separator } from "./separator"

export interface DateRangePickerProps {
  className?: string
  value?: DateRange | undefined
  onChange?: (date: DateRange | undefined) => void
  placeholder?: string
}

export function DateRangePicker({
  className,
  value,
  onChange,
  placeholder = "Pick a date range",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value)
  const [fromInputValue, setFromInputValue] = React.useState<string>(
    date?.from ? format(date.from, "yyyy-MM-dd") : ""
  )
  const [toInputValue, setToInputValue] = React.useState<string>(
    date?.to ? format(date.to, "yyyy-MM-dd") : ""
  )
  const [isFromCalendarOpen, setIsFromCalendarOpen] = React.useState(false)
  const [isToCalendarOpen, setIsToCalendarOpen] = React.useState(false)

  // Update local state when external value changes
  React.useEffect(() => {
    setDate(value)
    if (value?.from) {
      setFromInputValue(format(value.from, "yyyy-MM-dd"))
    }
    if (value?.to) {
      setToInputValue(format(value.to, "yyyy-MM-dd"))
    }
  }, [value])

  // Handle manual input for "from" date
  const handleFromInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromInputValue(e.target.value)

    try {
      if (e.target.value) {
        const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
        
        if (!isNaN(parsedDate.getTime())) {
          const newDateRange = {
            from: parsedDate,
            to: date?.to,
          }
          setDate(newDateRange)
          onChange?.(newDateRange)
        }
      } else {
        // If input is cleared, update the date range accordingly
        const newDateRange = date?.to ? { from: undefined, to: date.to } : undefined
        setDate(newDateRange)
        onChange?.(newDateRange)
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  }

  // Handle manual input for "to" date
  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToInputValue(e.target.value)

    try {
      if (e.target.value) {
        const parsedDate = parse(e.target.value, "yyyy-MM-dd", new Date())
        
        if (!isNaN(parsedDate.getTime())) {
          const newDateRange = {
            from: date?.from,
            to: parsedDate,
          }
          setDate(newDateRange)
          onChange?.(newDateRange)
        }
      } else {
        // If input is cleared, update the date range accordingly
        const newDateRange = date?.from ? { from: date.from, to: undefined } : undefined
        setDate(newDateRange)
        onChange?.(newDateRange)
      }
    } catch (error) {
      // Invalid date format, do nothing
    }
  }

  // Handle selecting a predefined date range
  const handleSelectPredefinedRange = (
    e: React.MouseEvent<HTMLButtonElement>,
    range: DateRange
  ) => {
    e.preventDefault()
    setDate(range)
    onChange?.(range)

    if (range.from) {
      setFromInputValue(format(range.from, "yyyy-MM-dd"))
    }
    if (range.to) {
      setToInputValue(format(range.to, "yyyy-MM-dd"))
    }
  }

  // Predefined date ranges
  const predefinedRanges = [
    {
      name: "Last 10 years (2014-2025)",
      range: {
        from: new Date(2014, 0, 1),
        to: new Date(2025, 11, 31),
      },
    },
    {
      name: "2020 - 2025",
      range: {
        from: new Date(2020, 0, 1),
        to: new Date(2025, 11, 31),
      },
    },
    {
      name: "2014 - 2019",
      range: {
        from: new Date(2014, 0, 1),
        to: new Date(2019, 11, 31),
      },
    },
    {
      name: "Last 3 months",
      range: {
        from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        to: new Date(),
      },
    },
  ]

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 max-w-[350px]" 
          align="start"
        >
          <div className="grid grid-cols-1 gap-2 p-2">
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-2">Manual input</div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <Label htmlFor="from-date" className="text-xs">From</Label>
                      <div className="relative">
                        <Input 
                          id="from-date" 
                          type="text" 
                          placeholder="YYYY-MM-DD"
                          value={fromInputValue} 
                          onChange={handleFromInputChange}
                          className="h-8 pr-8"
                        />
                        <Popover open={isFromCalendarOpen} onOpenChange={setIsFromCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-8 w-8"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date?.from}
                              onSelect={(day) => {
                                if (day) {
                                  const newRange = {
                                    from: day,
                                    to: date?.to
                                  }
                                  setDate(newRange)
                                  onChange?.(newRange)
                                  setFromInputValue(format(day, "yyyy-MM-dd"))
                                  setIsFromCalendarOpen(false)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="relative">
                      <Label htmlFor="to-date" className="text-xs">To</Label>
                      <div className="relative">
                        <Input 
                          id="to-date" 
                          type="text" 
                          placeholder="YYYY-MM-DD"
                          value={toInputValue} 
                          onChange={handleToInputChange}
                          className="h-8 pr-8"
                        />
                        <Popover open={isToCalendarOpen} onOpenChange={setIsToCalendarOpen}>
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="absolute right-0 top-0 h-8 w-8"
                            >
                              <CalendarIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={date?.to}
                              onSelect={(day) => {
                                if (day) {
                                  const newRange = {
                                    from: date?.from,
                                    to: day
                                  }
                                  setDate(newRange)
                                  onChange?.(newRange)
                                  setToInputValue(format(day, "yyyy-MM-dd"))
                                  setIsToCalendarOpen(false)
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />

              <div>
                <div className="text-sm font-medium mb-2">Quick select</div>
                <div className="flex flex-col gap-2">
                  {predefinedRanges.map((predefinedRange) => (
                    <Button
                      key={predefinedRange.name}
                      variant="outline"
                      className="justify-start font-normal text-xs h-8"
                      onClick={(e) =>
                        handleSelectPredefinedRange(e, predefinedRange.range)
                      }
                    >
                      {predefinedRange.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />
              
              <Button
                variant="outline"
                className="justify-start font-normal text-destructive"
                onClick={() => {
                  setDate(undefined)
                  onChange?.(undefined)
                  setFromInputValue("")
                  setToInputValue("")
                }}
              >
                Clear selection
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
