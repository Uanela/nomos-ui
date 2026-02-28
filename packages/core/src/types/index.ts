import { LinkConfig } from "../components/provider";

export type RouterAdapter = {
  useSearchParams: () => { get: (key: string) => string | null };
  useUpdateSearchParams: () => (
    params: { name: string; value: string }[]
  ) => void;
  useParams: () => { get: (key: string) => string | null };
  components: {
    Link: LinkConfig;
  };
};
