import { useRouter } from "next/navigation";

export default function useUpdateSearchParams() {
  const router = useRouter();

  return function (fields: { name: string; value: string }[]) {
    const url = new URL(location.href);
    fields.forEach((field) => url.searchParams.set(field.name, field.value));
    router.push(url.href);
  };
}
