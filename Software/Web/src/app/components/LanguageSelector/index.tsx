import { observer } from "mobx-react";
import React from "react";
import { lang, LocaleMessage, LocaleStore } from "../../internationalization";
import { observable, runInAction } from "mobx";
import { Dropdown, Icon, Menu } from "antd";
import { Inject } from "react.di";

interface Props {
  className?: string;
}

@observer
export default class LanguageSelector extends React.Component<Props, {}> {
  @observable switchingToId: string = "";

  @Inject localeStore: LocaleStore;

  constructMenu() {
    const items = this.constructChildren();
    return <Menu>
      {items}
    </Menu>;
  }

  languageOnClickProducer = (id: string) => async () => {
    runInAction(() => {
      this.switchingToId = id;
    });
    await this.localeStore.changeLanguage(id);
    runInAction(() => {
      this.switchingToId = "";
    });

  }

  constructChildren() {
    return this.localeStore.allLanguages.filter((x) => x.id !== this.localeStore.currentLanguage.id).map((x) =>
      <Menu.Item key={x.id}>
        <a onClick={this.languageOnClickProducer(x.id)}>
          {x.name}
          { this.switchingToId === x.id
          ?             <LocaleMessage id={lang().languageSelector.loading}/>
          : null
          }
        </a>

      </Menu.Item>,
    );
  }

  render() {
    return <Dropdown className={this.props.className} overlay={this.constructMenu()}>
      <a className="ant-dropdown-link">
        {this.localeStore.currentLanguage.name} <Icon type="down" />
      </a>
    </Dropdown>
;
  }
}
