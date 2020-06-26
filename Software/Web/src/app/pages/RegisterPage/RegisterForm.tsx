import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { FormComponentProps } from "antd/lib/form";
import { observer } from "mobx-react";
import { LocaleStore } from "../../internationalization";
import lang from "../../internationalization/LocaleStore/lang";
import { Inject } from "react.di";
import EmailValidationModal from "../../components/EmailValidationModal";
import { UserRole } from "../../models/user/User";
import { UserService } from "../../api/UserService";
import { NetworkError } from "../../api/NetworkResponse";
import { RouterStore } from "../../routing/RouterStore";
import { UserStore } from "../../stores/UserStore";
import { Link } from "react-router-dom";

interface RegisterFormProps extends FormComponentProps {
}

interface State {
  username: string;
  password: string;
  email: string;
  role: UserRole;
  submitting: boolean;
  validationModalVisible: boolean;
  token: string;
}

/**
 * SignIn Form
 */
@observer
class RegisterFormDetail extends React.Component<RegisterFormProps, State> {
  @Inject localeStore: LocaleStore;
  @Inject userService: UserService;
  @Inject routerStore: RouterStore;
  @Inject userStore: UserStore;

  state = {
    role: UserRole.USER,
    username: "",
    email: "",
    password: "",
    submitting: false,
    validationModalVisible: false,
    token: "",
  };

  handleUsernameInput = (e) => {
    this.setState({
      username: e.target.value,
    });
  }

  handlePasswordInput = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  handleEmailInput = (e) => {
    this.setState({
      email: e.target.value,
    });
  }

  handleSubmit = async () => {

    const data = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      role: this.state.role,
    };

    this.setState({submitting: true});
    try {
      const res = await this.userService.register(data);
      this.setState({
        submitting: false,
        token: res.token,
        validationModalVisible: true,
      });
    } catch (e) {
      console.log(e);
      const e1 = e as NetworkError;
      switch (e1.statusCode) {
        case 409:
          message.error(this.localeStore.get(lang().signIn.error.exists[e1.info.field]));
          break;
      }

    }
    this.setState({ submitting: false });
  }

  /**
   * 验证输入
   * @param e
   */
  validateInput = (e) => {
    // 是否正确格式
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (!values.agreement) {
          message.error(this.localeStore.get(lang().signIn.error.check));
        } else {
          this.handleSubmit();
        }

      }
    });
  }

  /**
   * 关闭弹出框调用的方法
   */
  closeModal = async (validated: boolean, remember: boolean) => {
    this.setState({validationModalVisible: false});

    if (validated) {
      try {
        const user = await this.userStore.requestLogin(this.state.username, this.state.password);
        this.userStore.login(user, remember);
        this.routerStore.push("/user");
      } catch (e) {
        console.log(e);
      }
    }
  }

  render() {

    const {getFieldDecorator} = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 6},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
      },
    };

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 20,
          offset: 4,
        },
      },
    };

    const buttonFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 4,
        },
      },
    };

    return (

      <Form onSubmit={this.handleSubmit}>

        <Form.Item
          label={this.localeStore.get(lang().signIn.username)}
          {...formItemLayout}
        >
          {getFieldDecorator("username", {
            rules: [{
              // TODO 这边this好像拿不到localeStore
              required: true, message: "用户名不能为空",
            }],
          })(
            <Input onChange={this.handleUsernameInput}/>,
          )}
        </Form.Item>

        <Form.Item
          {...formItemLayout}
          label={this.localeStore.get(lang().signIn.email)}
        >
          {getFieldDecorator("email", {
            rules: [{
              type: "email", message: "您输入的邮箱格式不正确",
            }, {
              required: true, message: "邮箱不能为空",
            }],
          })(
            <Input onChange={this.handleEmailInput}/>,
          )}
        </Form.Item>

        <Form.Item
          label={this.localeStore.get(lang().signIn.password)}
          {...formItemLayout}
        >
          {getFieldDecorator("password", {
            rules: [{
              required: true, message: "密码不能为空",
            }],
          })(
            <Input type="password" onChange={this.handlePasswordInput}/>,
          )}
        </Form.Item>

        <Form.Item
          label={this.localeStore.get(lang().signIn.confirmPassword)}
          {...formItemLayout}
        >
          {getFieldDecorator("passwordConfirm", {
            rules: [{
              required: true, message: "密码不能为空",
            }, {
              validator: (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue("password")) {
                  callback("输入的密码不一致");
                } else {
                  callback();
                }
              },
            }],
          })(
            <Input type="password"/>,
          )}
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          {getFieldDecorator("agreement", {
            valuePropName: "checked",
          })(
            <Checkbox>{this.localeStore.get(lang().signIn.protocolPrompt)}
              <Link to={"/help/tos"}>{this.localeStore.get(lang().signIn.protocol)}</Link></Checkbox>,
          )}
        </Form.Item>

        <Form.Item {...buttonFormItemLayout}>
          <Button loading={this.state.submitting} type="primary" block={true}
                  onClick={this.validateInput}>{this.localeStore.get(lang().signIn.register)}</Button>
        </Form.Item>
        {
          this.state.validationModalVisible
            ?  <EmailValidationModal userToken={this.state.token}
                                     visible={this.state.validationModalVisible}
                                     onClose={this.closeModal}
                                     sendEmailDirectly={true}
                                     showRememberCheck={true}
            />
            : null
        }

      </Form>

    );
  }
}

export const RegisterForm = Form.create({})(RegisterFormDetail);
