import * as React from "react";
import { AsteriskIcon, CloudUploadIcon, FileIcon, XIcon } from "lucide-react";
import { cn } from "../utils/shadcn-ui/utils";

type FileInputPropsBase = {
  /** Additional class name for the root container. */
  className?: string;
  /** Props forwarded to the dropzone wrapper div. */
  dropzoneProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Label text rendered above the dropzone. */
  label?: string;
  /** Props forwarded to the label wrapper div. */
  labelProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Marks the field as required for native form validation. */
  required?: boolean;
  /**
   * When `true`, renders a red asterisk next to the label.
   * Only has an effect when `required` is also `true`.
   */
  showRequiredSign?: boolean;
  /** Helper text rendered below the file list (hidden when `error` is set). */
  tip?: string;
  /** Validation error message rendered below the file list in destructive color. */
  error?: string;
  /**
   * Accepted file types forwarded directly to the native `<input accept>`.
   * Supports MIME types (e.g. `"image/*"`) and extensions (e.g. `".pdf,.docx"`).
   */
  accept?: string;
  /**
   * Human-readable format list shown inside the dropzone subtitle.
   * Keep in sync with `accept` but written for end-users (e.g. `"JPEG, PNG, PDF"`).
   */
  acceptLabel?: string;
  /**
   * Maximum allowed file size **in bytes**.
   * Files that exceed this limit are rejected — `onError` is called and the
   * file is NOT added to the list.
   *
   * @example
   * // 50 MB limit
   * maxSize={50 * 1024 * 1024}
   */
  maxSize?: number;
  /**
   * Fired when a file is rejected before being added to the list.
   * Common reasons: file exceeds `maxSize`.
   *
   * @param message - A human-readable description of why the file was rejected.
   */
  onError?: (message: string) => void;
  /** Disables the dropzone click / drag and all per-file remove buttons. */
  disabled?: boolean;
};

type FileInputPropsSingle = FileInputPropsBase & {
  /**
   * When `false` (default) `onChange` receives a single `File | null`.
   */
  multiple?: false;
  /** The currently selected file, or `null` when empty. */
  value?: File | null;
  /**
   * Fired whenever the selected file changes or is removed.
   *
   * @param file - The selected file, or `null` when cleared.
   */
  onChange?: (file: File | null) => void;
};

type FileInputPropsMultiple = FileInputPropsBase & {
  /**
   * When `true` `onChange` receives the full updated `File[]`.
   */
  multiple: true;
  /**
   * Controlled list of currently accepted files.
   * Pass an empty array (`[]`) to represent an empty / reset state.
   */
  value?: File[];
  /**
   * Fired whenever the file list changes — either a file was added or removed.
   *
   * @param files - The complete updated file list.
   */
  onChange?: (files: File[]) => void;
};

/**
 * A file-upload input that follows the shadcn component ideology.
 *
 * Features:
 * - Semantic design tokens (`foreground`, `muted-foreground`, `destructive`, …)
 * - Label + required sign + tip + error pattern identical to `Input` / `Textarea`
 * - Drag-and-drop with a clear visual drag state
 * - Per-file rows listing name, size, and a remove button
 * - Single or multiple file support — `onChange` type is narrowed automatically
 * - Pure `File` / `File[]` public API — no wrapper objects leaked to consumers
 * - React keys managed internally via `WeakMap` + `crypto.randomUUID()`
 *
 * @example Single file
 * ```tsx
 * const [file, setFile] = React.useState<File | null>(null);
 *
 * <FileInput
 *   label="Resume"
 *   accept=".pdf"
 *   acceptLabel="PDF"
 *   maxSize={50 * 1024 * 1024}
 *   value={file}
 *   onChange={setFile}
 * />
 * ```
 *
 * @example Multiple files
 * ```tsx
 * const [files, setFiles] = React.useState<File[]>([]);
 *
 * <FileInput
 *   label="Attachments"
 *   multiple
 *   accept=".pdf,.docx"
 *   acceptLabel="PDF, DOCX"
 *   value={files}
 *   onChange={setFiles}
 * />
 * ```
 */
export type FileInputProps = FileInputPropsSingle | FileInputPropsMultiple;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileInput({
  className,
  dropzoneProps,
  label,
  labelProps,
  required = false,
  showRequiredSign = false,
  tip,
  error,
  accept,
  acceptLabel,
  maxSize,
  multiple = false,
  value,
  onChange,
  onError,
  disabled = false,
}: FileInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const idMapRef = React.useRef<WeakMap<File, string>>(new WeakMap());

  function getFileId(file: File): string {
    if (!idMapRef.current.has(file)) {
      idMapRef.current.set(file, crypto.randomUUID());
    }
    return idMapRef.current.get(file)!;
  }

  const fileList: File[] = multiple
    ? ((value as File[]) ?? [])
    : value
      ? [value as File]
      : [];

  function processFiles(rawFiles: FileList | null) {
    if (!rawFiles || disabled) return;

    const incoming: File[] = [];

    Array.from(rawFiles).forEach((file) => {
      if (maxSize && file.size > maxSize) {
        onError?.(
          `"${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
        );
        return;
      }
      incoming.push(file);
    });

    if (!incoming.length) return;

    if (multiple) {
      (onChange as (files: File[]) => void)?.([...fileList, ...incoming]);
    } else {
      (onChange as (file: File | null) => void)?.(incoming[0] ?? null);
    }
  }

  function removeFile(file: File) {
    if (multiple) {
      (onChange as (files: File[]) => void)?.(
        fileList.filter((f) => f !== file)
      );
    } else {
      (onChange as (file: File | null) => void)?.(null);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }

  const { className: dropzoneClassName, ...restDropzoneProps } =
    dropzoneProps ?? {};
  const { className: labelClassName, ...restLabelProps } = labelProps ?? {};

  const hasFiles = fileList.length > 0;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <div
          {...restLabelProps}
          className={cn("flex items-center gap-1", labelClassName)}
        >
          <label className="text-sm font-bold text-foreground">{label}</label>
          {required && showRequiredSign && (
            <AsteriskIcon className="h-3 w-3 text-destructive" />
          )}
        </div>
      )}

      <div
        {...restDropzoneProps}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          "border-input bg-transparent",
          !disabled && "hover:border-ring/50 hover:bg-accent/40",
          isDragging && "border-ring bg-accent/60",
          error && "border-destructive",
          disabled && "cursor-not-allowed opacity-50",
          dropzoneClassName
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(e) => processFiles(e.target.files)}
        />

        <CloudUploadIcon
          className={cn(
            "h-8 w-8 transition-colors",
            isDragging ? "text-ring" : "text-muted-foreground"
          )}
          strokeWidth={1.5}
        />

        <div className="pointer-events-none select-none space-y-1">
          <p className="text-sm font-medium text-foreground">
            Choose a file or drag &amp; drop it here
          </p>
          {(acceptLabel || maxSize) && (
            <p className="text-xs text-muted-foreground">
              {[acceptLabel, maxSize ? `up to ${formatBytes(maxSize)}` : null]
                .filter(Boolean)
                .join(", ")}
            </p>
          )}
        </div>

        <span className="pointer-events-none select-none inline-flex items-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium shadow-xs">
          Browse File
        </span>
      </div>

      {hasFiles && (
        <ul className="space-y-2">
          {fileList.map((file) => (
            <li
              key={getFileId(file)}
              className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2.5 shadow-xs"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-input bg-muted">
                <FileIcon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>

              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="shrink-0 rounded-full p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Remove ${file.name}`}
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {tip && !error && (
        <p className="text-xs text-muted-foreground tip-message">{tip}</p>
      )}

      {error && (
        <p className="text-xs text-destructive error-message">*{error}</p>
      )}
    </div>
  );
}
