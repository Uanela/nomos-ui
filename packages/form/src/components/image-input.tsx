import React from "react";
import { ImageIcon, X, AsteriskIcon, CircleHelpIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type ImageInputProps = {
  value?: File | string | null;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  className?: string;
  dropzoneClassName?: string;
  previewClassName?: string;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  error?: string;
  name: string;
  label?: string;
  required?: boolean;
  showRequiredSign?: boolean;
  tip?: string;
  renderEmpty?: () => React.ReactNode;
  renderPreview?: (url: string, onRemove: () => void) => React.ReactNode;
};

export default function ImageInput({
  value,
  onChange,
  onError,
  className,
  dropzoneClassName,
  previewClassName,
  disabled = false,
  accept = "image/*",
  maxSize,
  error,
  name,
  label,
  required = false,
  showRequiredSign = false,
  tip,
  renderEmpty,
  renderPreview,
}: ImageInputProps) {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFile = (file: File | null) => {
    if (file) {
      if (maxSize && file.size > maxSize) {
        onError?.(`Max size: ${Math.round(maxSize / (1024 * 1024))}MB`);
        return;
      }
      onChange?.(file);
    } else {
      onChange?.(null);
    }
  };

  const handleRemove = () => {
    handleFile(null);
  };

  let previewUrl = null;
  if (value instanceof File) {
    previewUrl = URL.createObjectURL(value);
  } else if (typeof value === "string") {
    previewUrl = value;
  }

  return (
    <div className={twMerge("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={`input-${name}`}
            className="text-sm font-bold text-foreground"
          >
            {label}
          </label>
          {required && showRequiredSign && (
            <AsteriskIcon className="w-3 h-3 text-destructive" />
          )}
          {tip && (
            <div className="ml-auto relative group">
              <CircleHelpIcon className="w-4 h-4 text-muted-foreground cursor-help" />
              <span className="absolute left-1/2 -translate-x-1/2 top-6 w-max max-w-xs px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md border border-input shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {tip}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="relative h-48 w-full">
        <input
          type="file"
          id={`input-${name}`}
          name={`input-${name}`}
          accept={accept}
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!disabled && e.dataTransfer.files?.[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
        />

        <div
          className={twMerge(
            "w-full h-full border-2 border-input border-dashed rounded-lg flex items-center justify-center bg-transparent transition-colors",
            disabled && "opacity-50 cursor-not-allowed",
            isDragging && "border-primary bg-primary/5",
            !isDragging &&
            !previewUrl &&
            "border-input hover:border-primary/50",
            dropzoneClassName
          )}
        >
          {previewUrl ? (
            renderPreview ? (
              renderPreview(previewUrl, handleRemove)
            ) : (
              <div
                className={twMerge("relative w-full h-full", previewClassName)}
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove();
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors z-20 shadow-sm"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          ) : renderEmpty ? (
            renderEmpty()
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground px-4">
              <ImageIcon className="w-8 h-8" />
              <p className="text-sm text-center">
                {disabled
                  ? "Upload desabilitado"
                  : "Arraste uma imagem ou clique para selecionar"}
              </p>
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
