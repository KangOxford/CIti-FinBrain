import React from "react";
import { Inject } from "react.di";
import styled from "styled-components";
import { UserStore } from "../../stores/UserStore";
import { RouterStore } from "../../routing/RouterStore";
import { DefinitionItem } from "../../components/DefinitionItem";
import { LocaleMessage } from "../../internationalization/components";
import { UserService } from "../../api/UserService";
import { AsyncComponent } from "../../routing/AsyncComponent";
import { requireLogin, RequireLoginProps } from "../hoc/RequireLogin";
import lang from "../../internationalization/LocaleStore/lang";
import { action, observable, runInAction } from "mobx";
import { UserProfile } from "../../models/user/UserProfile";
import CitiBindModal from "./CitiBindModal";
import Loading from "../../components/Loading";
import { observer } from "mobx-react";

interface Props extends RequireLoginProps {

}

const ImgContainer = styled.div`
    display: flex;
    margin-top: -50px;
    width:105px;
    height:105px;
    transform: translateY(0px);
    opacity: 1;
    padding: 3px;
    background: #fff;
    box-shadow: 0 0 10px #95a5a6;
`;

/* tslint:disable:max-line-length */
const Banner = styled.div`
  height: 350px;

  border-radius: 30px;
  background: url("https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1528542180301&di=7a3d9d56e4ef3cb8bacee590be5e4578&imgtype=0&src=http%3A%2F%2Fimg.yanj.cn%2Fstore%2Fgoods%2F6081%2F6081_45ee01aace5f06d7d7eb42162834acba.jpg_max.jpg") no-repeat center;
  background-size: cover;
  position: relative;
`;
/* tslint:enable:max-line-length */

const root = lang().userCenter.profile;

@requireLogin()
@observer
export default class ProfileDisplay extends React.Component<Props, {}> {
  @Inject userService: UserService;
  // @Inject userService: UserService;
  @Inject routerStore: RouterStore;

  @observable profile: UserProfile;

  @observable citiUsername: string;

  @observable citiModalShown: boolean = false;

  @observable loading = true;

  @action loadData = async () => {

    this.loading = true;

    const username = this.props.user.username;
    // const username = "julia9803";
    const info = await this.userService.getUserProfile(username);
    console.log(info);
    // alert(info.email + " " + info.registerDate);
    const citi = await this.userService.getCitiAccount();

    runInAction(() => {
      this.profile = info;
      this.citiUsername = citi.username;
      this.loading = false;
    });
  }

  @action showModal = () => {
    this.citiModalShown = true;
  }

  @action onModalClose = (refresh: boolean) => {
    this.citiModalShown = false;
    if (refresh) {
      this.loadData();
    }
  }

  componentDidMount() {
    this.loadData();
  }

  render() {
    const { profile, citiUsername, loading, citiModalShown} = this;

    if (loading) {
      return <Loading/>;
    }

    const username = this.props.user.username;
    return (
      <div>
        <Banner style={{borderRadius: 20}}/>
        <div style={{maxWidth: "1000px", margin: "0 auto", marginBottom: "10px"}}>
          <div style={{marginLeft: "45%", marginRight: "auto"}}>
            <ImgContainer style={{borderRadius: 200}}>
              <img src={profile.avatarUrl}
                   width={100}
                   height={100}
                   style={{borderRadius: 200}}/>
            </ImgContainer>
            <h1 style={{marginBottom: 30, marginTop: 50}}>
              {username}
            </h1>
          </div>
          <h3>
            <div style={{marginLeft: "auto", marginRight: "auto", maxWidth: "500px", marginTop: 100}}>
              <DefinitionItem prompt={<LocaleMessage id={root.email}/>}>
                {profile.email}
              </DefinitionItem>
              <DefinitionItem prompt={<LocaleMessage id={root.registerDate}/>}>
                {profile.registerDate}
              </DefinitionItem>
              <DefinitionItem prompt={<LocaleMessage id={root.citiAccount.title}/>}>
                {citiUsername
                  ? citiUsername
                  : <a onClick={this.showModal}><LocaleMessage id={root.citiAccount.none}/></a>
                }
              </DefinitionItem>
            </div>
          </h3>
          <CitiBindModal shown={citiModalShown} onClose={this.onModalClose}/>
        </div>
      </div>
    );
  }
}
