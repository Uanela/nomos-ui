import { Popover, PopoverContent, PopoverTrigger } from './shadcn-ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './shadcn-ui/command';
import { twMerge } from 'tailwind-merge';
import { AsteriskIcon, Check, ChevronDown, Loader2, X } from 'lucide-react';
import React, { useState } from 'react';
import {
  PopoverContentProps,
  PopoverTriggerProps,
} from '@radix-ui/react-popover';

export type ComboboxOption<T = string> = {
  value: T;
  label: React.ReactNode;
  /** Plain-text fallback used for the default (non-async) filter match. */
  searchText?: string;
};

export type ComboboxProps<T = string> = {
  className?: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  options: ComboboxOption<T>[];
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  labelProps?: React.ComponentProps<'label'>;
  triggerProps?: PopoverTriggerProps & { id?: string; className?: string };
  contentProps?: PopoverContentProps;
  error?: string;
  tip?: string;

  /** Search box (Command input) config */
  searchPlaceholder?: string;
  emptyMessage?: string;
  /**
   * Controlled search value + handler — pass these for async/remote search
   * (you own fetching and filtering). When provided, Command's built-in
   * client-side filtering is disabled so it doesn't fight your results.
   */
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  isLoading?: boolean;
};

export default function Combobox<T extends string = string>({
  className,
  label,
  required = false,
  showRequiredSign = false,
  options,
  value,
  onChange,
  placeholder,
  multiple = false,
  disabled = false,
  labelProps,
  triggerProps,
  contentProps,
  error,
  tip,
  searchPlaceholder = 'Pesquisar...',
  emptyMessage = 'Nenhum resultado.',
  searchValue,
  onSearchValueChange,
  isLoading = false,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);
  const isAsync = onSearchValueChange !== undefined;

  const selectedValues = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value !== undefined && value !== null && value !== ''
      ? [value as T]
      : [];

  const selectedOptions = selectedValues
    .map((v) => options.find((opt) => opt.value === v))
    .filter(Boolean) as ComboboxOption<T>[];

  const handleSelect = (optionValue: T) => {
    if (!multiple) {
      onChange?.(optionValue);
      setOpen(false);
      return;
    }

    const current = Array.isArray(value) ? value : [];
    const isSelected = current.includes(optionValue);
    onChange?.(
      isSelected
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue],
    );
  };

  const handleRemoveTag = (e: React.MouseEvent, v: T) => {
    e.stopPropagation();
    if (!multiple || !Array.isArray(value)) return;
    onChange?.(value.filter((val) => val !== v));
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : (undefined as any));
  };

  const triggerLabel = () => {
    if (multiple) {
      return selectedOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2 flex-1">
          {selectedOptions.map((opt) => (
            <div
              key={String(opt.value)}
              className="flex items-center gap-1 px-1 py-1 text-sm bg-blue-100 text-blue-800 rounded-md"
            >
              {opt.label}
              <X
                size={14}
                className="cursor-pointer hover:text-blue-600"
                onClick={(e) => handleRemoveTag(e, opt.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        <span className="text-muted-foreground">
          {placeholder !== undefined ? placeholder : `${label}...`}
        </span>
      );
    }

    return selectedOptions[0] ? (
      <span className="flex-1 truncate text-left">
        {selectedOptions[0].label}
      </span>
    ) : (
      <span className="flex-1 truncate text-left text-muted-foreground">
        {placeholder !== undefined ? placeholder : `${label}...`}
      </span>
    );
  };

  return (
    <div className={twMerge('gap-1 grid w-full', className)}>
      {label && (
        <div className="flex flex-row items-center gap-1">
          <label
            {...labelProps}
            {...((labelProps?.htmlFor || triggerProps?.id) && {
              htmlFor: labelProps?.htmlFor || triggerProps?.id,
            })}
            className={twMerge('font-bold', labelProps?.className)}
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon size={12} color="red" />
          )}
        </div>
      )}

      <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            {...triggerProps}
            id={triggerProps?.id}
            disabled={disabled}
            data-state={open ? 'open' : 'closed'}
            className={twMerge(
              'flex w-full min-w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white p-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-sm data-[state=open]:outline-primary-500 data-[state=open]:outline-2 data-[state=open]:outline disabled:bg-zinc-100 disabled:cursor-not-allowed',
              triggerProps?.className,
            )}
          >
            {triggerLabel()}
            {!multiple && selectedOptions[0] && !disabled && (
              <X
                size={14}
                className="shrink-0 text-zinc-400 hover:text-zinc-600"
                onClick={handleClear}
              />
            )}
            {isLoading ? (
              <Loader2 size={16} className="shrink-0 animate-spin" />
            ) : (
              <ChevronDown
                size={16}
                className={twMerge(
                  'shrink-0 transition-transform duration-200',
                  open && 'rotate-180',
                )}
              />
            )}
          </button>
        </PopoverTrigger>

        <PopoverContent
          {...contentProps}
          className={twMerge(
            'w-[--radix-popover-trigger-width] p-0',
            contentProps?.className,
          )}
        >
          <Command shouldFilter={!isAsync}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={onSearchValueChange}
            />
            <CommandList>
              {!isLoading && <CommandEmpty>{emptyMessage}</CommandEmpty>}
              {isLoading && (
                <div className="flex items-center justify-center py-4 text-sm text-zinc-400">
                  <Loader2 size={14} className="mr-2 animate-spin" />
                  Carregando...
                </div>
              )}
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={String(option.value)}
                      value={option.searchText ?? String(option.value)}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        size={14}
                        className={twMerge(
                          'mr-2',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}
      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}

