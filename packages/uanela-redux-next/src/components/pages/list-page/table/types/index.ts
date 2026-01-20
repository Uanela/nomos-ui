export type FilterType =
  | "TEXT"
  | "NUMBER"
  | "DATE"
  | "SELECT"
  | "MULTISELECT"
  | "BOOLEAN"
  | "RELATION";

export type Filter = {
  id: number;
  field: string;
  type: FilterType;
  operator: string;
  value: string | string[] | boolean;
  value2?: string | string[] | boolean;
};

export type TableFieldInputType =
  | "text"
  | "select"
  | "checkbox"
  | "relation-picker"
  | "multi-select"
  | "number"
  | "date"
  | "datetime";

export type TableField<T> = {
  name: string;
  label: React.ReactNode;
  type: FilterType;
  inputType: TableFieldInputType;
  options?: { value: string; label: string }[] | string[];
  /**
   * Defines shared props between data and header
   *
   * PS: the `transform|onClick|onMouseEnter|onMouseLeave` prop here only works for data
   */
  props?: {
    transform?: (data: T) => React.ReactNode;
    onClick?: (data: T, field: TableField<T>, e: any) => any;
    onMouseEnter?: (data: T, field: TableField<T>, e: any) => any;
    onMouseLeave?: (data: T, field: TableField<T>, e: any) => any;
  } & Omit<
    React.ComponentProps<"div">,
    "children" | "onClick" | "onMouseEnter" | "onMouseLeave"
  >;
  /**
   * Defines props only for the head of the table
   *
   * This will take precedence of the shared `props`
   */
  headProps?: {
    transform?: (data: T[], field: TableField<T>) => React.ReactNode;
    onClick?: (data: T[], field: TableField<T>, e: any) => any;
    onMouseEnter?: (data: T[], field: TableField<T>, e: any) => any;
    onMouseLeave?: (data: T[], field: TableField<T>, e: any) => any;
  } & Omit<React.ComponentProps<"div">, "children">;
  /**
   * Defines props only for the data of the table
   *
   * This will take precedence of the shared `props`
   */
  dataProps?: {
    transform?: (data: T) => React.ReactNode;
    onClick?: (data: T, field: TableField<T>, e: any) => any;
    onMouseEnter?: (data: T, field: TableField<T>, e: any) => any;
    onMouseLeave?: (data: T, field: TableField<T>, e: any) => any;
  } & Omit<React.ComponentProps<"div">, "children">;
};
