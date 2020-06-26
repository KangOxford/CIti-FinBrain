import React from "react";
import SideNav from "./nav/SideNav";
import { Layout, Menu } from "antd";
import Footer from "../components/Footer";
import { Header } from "./nav/Header";
import { Link } from "react-router-dom";
import { NavbarModals } from "./nav/Header/NavbarModals";
import NotificationPanel from "./notification";

const {Content, Sider} = Layout;
const {SubMenu} = Menu;

interface Props {

}

interface State {

}

// @observer
export class MainLayout extends React.Component<Props, State> {

  render() {
    return (
      <Layout>
        <Header/>
        <Layout>
          <SideNav />
          {this.props.children}
        </Layout>
        <Footer/>
        <NavbarModals/>
        <NotificationPanel/>
      </Layout>
    );
  }
}
