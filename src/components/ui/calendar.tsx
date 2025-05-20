
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)} // p-3 is internal padding for DayPicker itself
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium text-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))] rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))]/15 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))] text-[hsl(var(--custom-green-foreground-h)_var(--custom-green-foreground-s)_var(--custom-green-foreground-l))] hover:bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_calc(var(--custom-green-l)_-_5%))] hover:text-[hsl(var(--custom-green-foreground-h)_var(--custom-green-foreground-s)_var(--custom-green-foreground-l))] focus:bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_calc(var(--custom-green-l)_-_5%))] focus:text-[hsl(var(--custom-green-foreground-h)_var(--custom-green-foreground-s)_var(--custom-green-foreground-l))]",
        day_today: "bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l)/0.15)] text-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))]",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l)/0.05)] aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l)/0.15)] aria-selected:text-[hsl(var(--custom-green-h)_var(--custom-green-s)_var(--custom-green-l))]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className: iconClassName, ...rest }) => ( // Renamed className to avoid conflict
          <ChevronLeft className={cn("h-4 w-4", iconClassName)} {...rest} />
        ),
        IconRight: ({ className: iconClassName, ...rest }) => ( // Renamed className to avoid conflict
          <ChevronRight className={cn("h-4 w-4", iconClassName)} {...rest} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
