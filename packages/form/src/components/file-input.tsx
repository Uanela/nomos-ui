import * as React from "react";
import { AsteriskIcon, CloudUploadIcon, FileIcon, XIcon } from "lucide-react";
import { cn } from "../utils/shadcn-ui/utils";

/**
 * Represents a single file entry managed by `FileInput`.
 *
 * The `id` is a stable random key generated on ingestion so React
 * reconciliation stays correct even when the same filename is added twice.
 */
export type FileInputFile = {
  /** The native browser `File` object. */
  file: File;
  /**
   * Stable random identifier assigned when the file is added.
   * Use this as the React `key` and to target a specific file for removal.
   */
  id: string;
};

type FileInputPropsBase = {
  /** Additional class name for the root container. */
  className?: string;
  /** Additional class name applied to the dashed dropzone area. */
  dropzoneClassName?: string;
  /** Label text rendered above the dropzone. */
  label?: string;
  /** Additional class name for the label row wrapper. */
  labelClassName?: string;
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
   * Allow the user to pick or drop more than one file at a time.
   * When `false` (default) `onChange` receives a single `FileInputFile | null`.
   */
  multiple?: false;
  /** The currently selected file, or `null` when empty. */
  value?: FileInputFile | null;
  /**
   * Fired whenever the selected file changes or is removed.
   *
   * @param file - The selected file, or `null` when cleared.
   */
  onChange?: (file: FileInputFile | null) => void;
};

type FileInputPropsMultiple = FileInputPropsBase & {
  /**
   * Allow the user to pick or drop more than one file at a time.
   * When `true` `onChange` receives the full updated `FileInputFile[]`.
   */
  multiple: true;
  /**
   * Controlled list of currently accepted files.
   * Pass an empty array (`[]`) to represent an empty / reset state.
   */
  value?: FileInputFile[];
  /**
   * Fired whenever the file list changes — either a file was added or removed.
   *
   * @param files - The complete updated file list.
   */
  onChange?: (files: FileInputFile[]) => void;
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
 *
 * @example Single file
 * ```tsx
 * const [file, setFile] = React.useState<FileInputFile | null>(null);
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
 * const [files, setFiles] = React.useState<FileInputFile[]>([]);
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

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export default function FileInput({
  className,
  dropzoneClassName,
  label,
  labelClassName,
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

  const fileList: FileInputFile[] = multiple
    ? ((value as FileInputFile[]) ?? [])
    : value
      ? [value as FileInputFile]
      : [];

  function processFiles(rawFiles: FileList | null) {
    if (!rawFiles || disabled) return;

    const incoming: FileInputFile[] = [];

    Array.from(rawFiles).forEach((file) => {
      if (maxSize && file.size > maxSize) {
        onError?.(
          `"${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
        );
        return;
      }
      incoming.push({ file, id: generateId() });
    });

    if (!incoming.length) return;

    if (multiple) {
      (onChange as (files: FileInputFile[]) => void)?.([
        ...fileList,
        ...incoming,
      ]);
    } else {
      (onChange as (file: FileInputFile | null) => void)?.(incoming[0] ?? null);
    }
  }

  function removeFile(id: string) {
    if (multiple) {
      (onChange as (files: FileInputFile[]) => void)?.(
        fileList.filter((f) => f.id !== id)
      );
    } else {
      (onChange as (file: FileInputFile | null) => void)?.(null);
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

  const hasFiles = fileList.length > 0;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && (
        <div className={cn("flex items-center gap-1", labelClassName)}>
          <label className="text-sm font-bold text-foreground">{label}</label>
          {required && showRequiredSign && (
            <AsteriskIcon className="h-3 w-3 text-destructive" />
          )}
        </div>
      )}

      <div
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
          {fileList.map(({ file, id }) => (
            <li
              key={id}
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
                  onClick={() => removeFile(id)}
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
