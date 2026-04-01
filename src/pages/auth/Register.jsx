import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Alert, Row, Col, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import "../../styles/auth.scss";
import logo from "../../assets/images/logo-green.png";
import * as _unitOfWork from "../../api";
import { id } from "date-fns/locale";
function Register() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState();
  const [form] = Form.useForm();

  const handleValidSubmit = async () => {
    const values = form.getFieldsValue();
    let resCompany = await _unitOfWork.user.getCompanyByCode("cong_ty_pnp");
    if (!resCompany || !resCompany?.company?.id) {
      setErrorMsg("Mã công ty không tồn tại!");
      return;
    }
    const payload = {
      email: values.email,
      fullName: values.fullname,
      username: values.username,
      password: values.password,
      company: resCompany?.company?.id,
      role: "687dbd7bb315e9854fe8d65e"
    };
    let res = await _unitOfWork.user.createUser(payload);
    if (res && res.id) {
      message.success("Đăng ký tài khoản thành công!");
      form.resetFields();
    } else {
      setErrorMsg(res.message || "Đăng ký tài khoản thất bại!");
    }
  };

  return (
    <div className="account-pages">
      <Row className="justify-center d-unset">
        <Col md={16} lg={16} xl={16} className="">
          <div className="text-center pt-5">
            <img
              src={logo}
              alt=""
              style={{ width: "60%", backgroundColor: "white", padding: 5 }}
            />
          </div>
          <Card bodyStyle={{ padding: 0 }} className="ml-3 mt-5 mr-3">
            <div className="p-3 pt-0">
              <div className="text-center">
                <p style={{ fontWeight: "bold", fontSize: "18px" }}>
                  ĐĂNG KÝ TÀI KHOẢN
                </p>
              </div>
              <Form
                name="register"
                form={form}
                onFinish={handleValidSubmit}
                autoComplete="off"
              >
                {errorMsg && <Alert message={errorMsg} type="error" />}

                <Form.Item
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                >
                  <Input
                    className="mb-3"
                    size="large"
                    prefix={<MailOutlined />}
                    type="email"
                    placeholder="Email"
                  />
                </Form.Item>

                <Form.Item
                  name="fullname"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input
                    className="mb-3"
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Họ và tên"
                  />
                </Form.Item>

                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên đăng nhập!" },
                  ]}
                >
                  <Input
                    className="mb-3"
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Tên đăng nhập"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Mật khẩu"
                  />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  dependencies={["password"]}
                  className="mt-3"
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng xác nhận mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không trùng khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Xác nhận mật khẩu"
                  />
                </Form.Item>
                {/* 
                <Form.Item
                  name="code"
                  rules={[
                    { required: true, message: "Vui lòng nhập mã công ty!" },
                  ]}
                  className="mt-3"
                >
                  <Input
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Mã công ty"
                  />
                </Form.Item> */}
                <Form.Item className="mt-3">
                  <Button
                    block
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
                <div className="mt-2">
                  Đã có tài khoản?{" "}
                  <Link className="text-primary" to="/login">
                    Đăng nhập ngay
                  </Link>
                </div>
              </Form>
            </div>
          </Card>
          <div
            className="mt-5 text-center"
            style={{ color: "white", fontSize: "16px" }}
          >
            <p>Hotline: 0949 854 758</p>
            <p>
              © {new Date().getFullYear()} MTC. Created with{" "}
              <i className="mdi mdi-heart text-danger"></i> by MTC
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Register;
