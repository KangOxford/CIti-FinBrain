import React from "react";
import { observer } from "mobx-react";
import { User, UserRole } from "../../models/user/User";
import { Inject } from "react.di";
import { UserStore } from "../../stores/UserStore";
import { LocaleMessage } from "../../internationalization/components";
import lang from "../../internationalization/LocaleStore/lang";
import { UiStore } from "../../stores/UiStore";
import { withRouter } from "react-router";

const root = lang().common.login;
/**
 * Marks that the component needs authentication.
 * Authentication will be run before the component is rendered.
 * If authentication succeeded,
 *  returns the wrapped component with { user: User } injected into props.
 * Otherwise,
 *  error will be rendered.
 * @param roles Accepted Roles. Empty is considered to accepted all roles.
 */
export function requireLogin(...roles: UserRole[]) {
  /* tslint:disable-next-line:only-arrow-functions */
  return function(WrappedComponent): any {
    @observer
    class Component extends React.Component {

      @Inject userStore: UserStore;
      @Inject uiStore: UiStore;

      render() {

        if (!this.userStore.loggedIn) {
          return <a onClick={this.uiStore.toggleLoginModalShown}>
            <LocaleMessage id={root.needLogin} />
          </a>;
        }
        if (roles.length > 0 && !roles.includes(this.userStore.user.role)) {
          return <LocaleMessage id={root.roleNotMatch} replacements={{

          }}/>;
        }
        return <WrappedComponent {...this.props}
                                 user={this.userStore.user}
        />;
      }

    }

    return withRouter(Component as any);
  };
}

export interface RequireLoginProps {
  user?: User;
}
