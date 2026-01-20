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
  props?: {
    transform?: (data: T) => React.ReactNode;
  } & Omit<React.ComponentProps<"div">, "children">;
};
