import { HTMLAttributes, ReactNode } from "react"
import { Dayjs } from "dayjs"
import { RangePickerProps, TimePickerProps } from "@illa-design/time-picker"
import { InputBorderColor } from "@illa-design/input"
import { BoxProps } from "@illa-design/theme"

export type PickerPosition =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
export type ShortcutType = {
  text: ReactNode
  value: () => Dayjs | Dayjs[]
} & Record<string, any>
export type PickerSize = "small" | "medium" | "large"
export type DatePickerCalendarValue = number | string | Date | Dayjs
export type DisabledTimeProps = {
  disabledHours?: () => number[]
  disabledMinutes?: () => number[]
  disabledSeconds?: () => number[]
}
export type RangePickerMode = "date" | "month" | "week" | "year" | "quarter"

export interface PickerProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "defaultValue" | "prefix" | "placeholder" | "onChange" | "onSelect"
    >,
    BoxProps {
  allowClear?: boolean
  position?: PickerPosition
  // placeholder?: string | string[]
  shortcuts?: ShortcutType[]
  shortcutsPlacementLeft?: boolean
  error?: boolean
  size?: PickerSize
  popupVisible?: boolean
  editable?: boolean
  locale?: Record<string, any>
  separator?: ReactNode
  disabledDate?: (current?: Dayjs) => boolean
  defaultPickerValue?: DatePickerCalendarValue
  utcOffset?: number
  timezone?: string
  colorScheme?: InputBorderColor
  readOnly?: boolean
  format?: string | ((value: Dayjs) => string)
  onSelectShortcut?: (shortcut: ShortcutType) => void
  onVisibleChange?: (visible?: boolean) => void
  onChange?: (dateString?: string, date?: Dayjs) => void
  onSelect?: (dateString: string, date: Dayjs) => void
  onOk?: (dateString: string, date: Dayjs) => void
  onClear?: () => void
}

export interface CommonSingleProps {
  placeholder?: string
  defaultValue?: DatePickerCalendarValue
  value?: DatePickerCalendarValue
  disabled?: boolean
}

export interface DatePickerProps extends PickerProps, CommonSingleProps {
  showTime?: boolean | TimePickerProps
  timepickerProps?: TimePickerProps
  showNowBtn?: boolean
  disabledTime?: (current?: Dayjs) => DisabledTimeProps
}

export interface MonthPickerProps extends PickerProps, CommonSingleProps {}

export interface YearPickerProps extends PickerProps, CommonSingleProps {}

export interface CommonRangeProps
  extends Omit<
    PickerProps,
    "onChange" | "defaultValue" | "onOk" | "defaultPickerValue" | "onSelect"
  > {
  disabled?: boolean | boolean[]
  format?: string | ((value: Dayjs) => string)
  onChange?: (dateString: string[], date: Dayjs[]) => void
  onSelect?: (dateString: string[], date: Dayjs[]) => void
  defaultValue?: DatePickerCalendarValue[]
  value?: DatePickerCalendarValue[]
  mode?: RangePickerMode
  showTime?: boolean | RangePickerProps
  placeholder?: string[]
  timepickerProps?: RangePickerProps
  onOk?: (dateString: string[], date: Dayjs[]) => void
  disabledTime?: (current: Dayjs, type: "start" | "end") => DisabledTimeProps
  defaultPickerValue?: DatePickerCalendarValue[]
}

export interface CommonProps
  extends Omit<
    PickerProps,
    | "prefix"
    | "placeholder"
    | "shortcuts"
    | "shortcutsPlacementLeft"
    | "defaultValue"
    | "defaultPickerValue"
    | "locale"
    | "disabledDate"
    | "utcOffset"
    | "timezone"
    | "onSelectShortcut"
    | "onSelect"
    | "onChange"
    | "onOk"
    | "onClear"
  > {}

export interface RenderSinglePickerProps extends Partial<DatePickerProps> {
  type: "day" | "month" | "year"
}

export interface RangePickerBodyProps extends CommonProps {
  disabled?: boolean | boolean[]
  placeholder?: string[]
  inputVal?: string[]
  separator?: ReactNode
  pickerContent: ReactNode
  onClearDate?: () => void
  onChangeInputVal?: (value: string[]) => void
  onChangeVisible?: (visible: boolean) => void
}
