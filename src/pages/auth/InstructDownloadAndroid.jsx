import { Link, useNavigate } from "react-router-dom";
import { Button, Row, Col, Card } from "antd";
import { ArrowLeftOutlined, DownloadOutlined } from "@ant-design/icons";

import buoc2 from "../../assets/images/buoc2.png";
import buoc3 from "../../assets/images/buoc3.png";
import buoc4_1 from "../../assets/images/b4.1.png";
import buoc4_2 from "../../assets/images/b4.2.png";
import buoc4_3 from "../../assets/images/b4.3.png";

function InstructDownloadAndroid() {
  const navigate = useNavigate();

  const onClickDownloadFile = () => {
    window.open("https://medicmms.vn/app_android_release.apk", "_blank");
  };

  const cardStyle = {
    width: "100%",
    maxWidth: 700,
    borderRadius: 10,
  };

  const imageStyle = {
    width: "100%",
    borderRadius: 8,
    marginTop: 10,
  };

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 56,
          background: "#23457b",
          color: "#fff",
          padding: "0 16px",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <ArrowLeftOutlined
          style={{ fontSize: 22, marginRight: 16, cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        Cài đặt ứng dụng trên Android
      </div>

      <Row justify="center" gutter={[0, 20]} style={{ padding: 8 }}>
        {/* Step 1 */}
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Card title="Bước 1: Tải file cài đặt" style={cardStyle}>
            <Button
              type="primary"
              size="large"
              icon={<DownloadOutlined />}
              onClick={onClickDownloadFile}
            >
              Tải file xuống
            </Button>
          </Card>
        </Col>

        {/* Step 2 */}
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Card title="Bước 2: Mở file APK" style={cardStyle}>
            <img src={buoc2} style={imageStyle} />
          </Card>
        </Col>

        {/* Step 3 */}
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Card title="Bước 3: Nhấn Cài đặt và hoàn thành" style={cardStyle}>
            <img src={buoc3} style={imageStyle} />
          </Card>
        </Col>

        {/* Step 4 */}
        <Col span={24} style={{ display: "flex", justifyContent: "center" }}>
          <Card title="Bước 4: Nếu chưa có quyền cài đặt" style={cardStyle}>
            <p style={{ fontWeight: 500 }}>Thực hiện theo các bước sau:</p>

            <img src={buoc4_1} style={imageStyle} />
            <img src={buoc4_2} style={imageStyle} />
            <img src={buoc4_3} style={imageStyle} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default InstructDownloadAndroid;