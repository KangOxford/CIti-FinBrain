import { NavItemProps } from "../NavItemProps";
import { lang } from "../../../internationalization";

const root = lang().nav;

export const mainNavs = [{
  path: "/",
  iconName: "home",
  id: root.home,
  match: (pathname: string) => pathname === "/",
},  {
  path: "/quotation",
  iconName: "line-chart",
  id: root.marketQuotation,
  match: (pathname: string) => pathname.startsWith("/quotation"),
}, {
  path: "/invreq",
  iconName: "solution",
  id: root.invreq,
  match: (pathname: string) => pathname.startsWith("/invreq"),
}, {
  path: "/help",
  iconName: "info-circle",
  id: root.help,
  match: (pathname: string) => pathname.startsWith("/help"),
},
];
