import { Inject, Injectable } from "react.di";
import { action, computed, observable } from "mobx";
import { RouterStore } from "../../routing/RouterStore";
import { availableNavPoints, NavPoint } from "./NavPoints";
import { NavItemProps } from "./NavItemProps";
import { arrayContainsElement } from "../../../utils/Array";
import { Stack } from "../../../utils/Stack";

interface SideNav {
  navs: NavItemProps[];
}

@Injectable
export class NavStore {

  constructor(@Inject private routerStore: RouterStore) {

  }

  @observable.ref sidenavs: NavItemProps[];

  @computed get hasSider() {
    return arrayContainsElement(this.sidenavs);
  }

  @observable sidebarCollapsed = false;

  // 或者符合当前路径的所有面包屑导航位置
  @computed get currentNavPath(): NavPoint[] {
    const path = this.routerStore.path;
    const points = availableNavPoints.map((x) => {
      if (typeof x.path === "string") {
        return path.startsWith(x.path) ? x : null;
      } else {
        // x.path is regex
        const match = path.match(x.path);
        if (match) {
          return { ...x, path: x.jumpTo(path) };
        } else {
          return null;
        }
      }
    }).filter((x) => !!x);
    return points;
  }

}
