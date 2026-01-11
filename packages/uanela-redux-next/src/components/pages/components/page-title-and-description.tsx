import { type ReactElement } from "react";

export default function PageTitleAndDescription({
  title,
  description,
}: {
  title?: string;
  description?: string;
}): ReactElement {
  return (
    <div>
      <h2 className="font-bold md:text-2xl text-xl text-zinc-800 line-clamp-1">
        {title}
      </h2>
      <p className="text-zinc-600 line-clamp-1">{description}</p>
    </div>
  );
}
