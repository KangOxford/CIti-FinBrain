import React from "react";
import styled from "styled-components";
import observer from "mobx-react";
import {Col, Row} from "antd";
import {RegisterPrompt} from "./RegisterPrompt";
import {RegisterForm} from "./RegisterForm";
import { LocaleMessage } from "../../internationalization";
import lang from "../../internationalization/LocaleStore/lang";

interface Props {

}

const RegisterContainer = styled.div`
    background-color: #001529;
    width: 100%;
    height: 800px;
`;

const FormContainer = styled.div`
  margin-top: 100px;
  background-color: #FFFFFF;
  border-radius: 20px;
  height: 100%;
  padding:20px;
`;

const RegisterText = styled.p`
  color: #001529;
  margin: 30px;
  font-size: 25px;
  border-bottom: #001529 2px solid;
`;

export default class RegisterPage extends React.Component<Props, any> {

  render() {
    return (
      <RegisterContainer>
        <Row>
          <Col xs={0} sm={0} md={12}>
            <RegisterPrompt/>
          </Col>
          <Col xs={0}  sm={0} md={3}/>
          <Col xs={24} sm={24} md={8}>
            <FormContainer>
              <RegisterText>
                <LocaleMessage id={lang().signIn.signPrompt}/>
              </RegisterText>
              <RegisterForm />
            </FormContainer>
          </Col>
          <Col xs={0}  sm={0} md={1}/>
        </Row>
      </RegisterContainer>
    );
  }
}
