import { forwardRef } from "react";
import { useProvider } from "../hooks/use-provider";

type LinkProps = {
  href: string;
} & Record<string, any>;

const Link = forwardRef<any, LinkProps>(({ href, ...props }, ref) => {
  let Component: any = "a";
  let hrefKey = "href";

  try {
    const { components } = useProvider();
    Component = components.Link.component;
    hrefKey = components.Link.hrefKey;
  } catch {}

  return <Component ref={ref} {...{ [hrefKey]: href }} {...props} />;
});

export default Link;
