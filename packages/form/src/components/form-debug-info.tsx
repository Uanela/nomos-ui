import { type ReactElement } from "react";
import { UseFormReturn } from "react-hook-form";

export default function FormDebugInfo({
  form,
}: {
  form: UseFormReturn<any>;
}): ReactElement {
  ///@ts-ignore
  return (process as any)?.env?.NODE_ENV === "development" ||
    ///@ts-ignore
    (import.meta as any)?.env?.NODE_ENV === "development" ? (
    <details className="">
      <summary className="cursor-pointer text-sm text-gray-500">
        Debug Info
      </summary>
      <pre className="text-xs bg-gray-100 p-4 rounded mt-2 overflow-auto">
        <strong>Form Errors:</strong>
        {JSON.stringify(form.formState.errors, null, 2)}
        <br />
        <strong>Form Values:</strong>
        {JSON.stringify(form.watch(), null, 2)}
      </pre>
    </details>
  ) : (
    <></>
  );
}
