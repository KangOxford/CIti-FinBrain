import { History } from "history";
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from "mobx-react-router";
import { action, computed } from "mobx";
import { Injectable } from "react.di";
import { parse } from "querystring";
import * as React from "react";

@Injectable
export class RouterStore extends BaseRouterStore {
  constructor(history: History) {
    super();
    this.history = syncHistoryWithStore(history, this);
  }

  @computed get query() {
    return parse(this.location.search.substr(1));
  }

  @computed get path() {
    return this.location.pathname;
  }

  @action jumpTo = (path: string) => {
    this.push(path);
  }

}
