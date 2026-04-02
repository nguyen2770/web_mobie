import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Alert, Row, Col, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import useAuth from "../../contexts/authContext";
import "../../styles/auth.scss";
import profileImg from "../../assets/images/profile-img.png";
import logo from "../../assets/images/logo-green.png";
import * as _unitOfWork from "../../api";
import { de } from "date-fns/locale";
import { STORAGE_KEY } from "../../utils/constant";
import downloadAd from "../../assets/images/downloadAd.jpg";
import downloadIOS from "../../assets/images/downloadIOS.jpg";
import { staticPath } from "../../router/RouteConfig";
import { staticPathUnAuthen } from "../../router/RouteUnAuthenConfig";

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [form] = Form.useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { username, password } = values;
    var deviceToken = localStorage.getItem(STORAGE_KEY.DEVICE_TOKEN);
    const payload = {
      username,
      password,
      deviceToken,
    };
    let res = await _unitOfWork.login({
      ...payload,
    });
    if (res && res.tokens) {
      login(res);
    }
    // console.log(res);
    // login(data);
    // const { username, password } = values;
    // setLoading(true)
    // const res = await login({ username, password });
    // if (res && res.success === 1) {
    //   setLoading(false);
    //   message.success('Đăng nhập thành công');
    //   const data = {
    //     access_token: res.token,
    //     user: res.user
    //   }
    //   props.onLogin(data);
    // } else {
    //   setLoading(false);
    //   message.error(res.message);
    // }
  };
  const onClickDownloadIos = () => {
    window.open(
      "https://apps.apple.com/us/app/medimain/id6757625890",
      "_blank",
    );
  };
  const onClickDownloadAndroid = () => {
    navigate(staticPathUnAuthen.instructDownloadAndroid);
  };
  return (
    <div className="account-pages">
      <Row className="justify-center d-unset">
        <Col md={16} lg={16} xl={16} className="">
          <div className="text-center pt-5">
            <img
              src={"sdf"}
              alt=""
              style={{ width: "60%", backgroundColor: "white", padding: 5 }}
            />
            {/* <p style={{ fontSize: '16px', color: 'white' }}>Hệ thống quản lý bảo trì tài sản</p> */}
          </div>
          <Card bodyStyle={{ padding: 0 }} className="ml-3 mt-5 mr-3">
            <div className="p-3 pt-0">
              <div className="text-center">
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                  ĐĂNG NHẬP HỆ THỐNG
                </p>
              </div>
              <Form
                name="login"
                form={form}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                autoComplete="off"
              >
                {/* {errorMsg && <Alert className="mb-3" message={errorMsg} type="error" />} */}

                <Form.Item
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: "Tên đăng nhập không được để trống!",
                    },
                  ]}
                >
                  <Input
                    className="mb-3"
                    size="large"
                    prefix={<MailOutlined />}
                    placeholder="Tên đăng nhập"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Mật khẩu không được để trống!",
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>
                <Row gutter={[16, 16]} className="mt-3">
                  <Col span={12}>
                    <Form.Item name="remember" valuePropName="checked">
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Link to="/forgot-password" className="text-muted">
                      Quên mật khẩu?
                    </Link>
                  </Col>
                </Row>

                <Form.Item className="mt-3">
                  <Button
                    id="bt-login-cmms"
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
                {/* <div className="mt-2">
                  Không có tài khoản?{" "}
                  <Link className="text-primary" to="/register">
                    Đăng ký ngay
                  </Link>
                </div> */}
                {/* <div className="mt-4 text-center">
                  <Link to="/forgot-password" className="text-muted">
                    <i className="mdi mdi-lock mr-1"></i> Quên mật khẩu?
                  </Link>
                </div> */}
              </Form>
            </div>
          </Card>
          <Row className="row-download-app">
            <Col span={12} className="p-4 ">
              <img src={downloadIOS} onClick={onClickDownloadIos}></img>
            </Col>
            <Col span={12} className="p-4">
              <img src={downloadAd} onClick={onClickDownloadAndroid}></img>
            </Col>
          </Row>
          <div
            className="mt-2 text-center"
            style={{ color: "white", fontSize: "16px" }}
          >
            {/* <p>Don't have an account?
              <Link to="/register" className="font-weight-medium text-primary">
                {" "}Signup now
              </Link>
            </p> */}
            <p>Hotline: 0367880184</p>
            <p>
              © {new Date().getFullYear()} DAHK2202503. Created with{" "}
              <i className="mdi mdi-heart text-danger"></i> by DAHK2202503
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
