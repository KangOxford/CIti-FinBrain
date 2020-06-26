import { parse, ParsedUrlQuery} from "querystring";
import { RouteComponentProps } from "react-router";

export function parseQueryString<T = any>(props: RouteComponentProps<T> | string): ParsedUrlQuery {
  if (typeof props === "string") {
    return parse(props.substring(1));
  }
  return parse(props.location.search.substring(1));
}
