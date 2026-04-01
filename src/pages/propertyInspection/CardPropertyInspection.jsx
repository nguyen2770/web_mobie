import {
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row } from "antd";
import { staticPath } from "../../router/RouteConfig";
import { useNavigate } from "react-router-dom";
import { parseToLabel } from "../../helper/parse-helper";
import { parseDatetime } from "../../helper/date-helper";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import ShowSuccess from "../../components/modal/result/successNotification";
import { useState } from "react";
import { propertyInspectionStatus } from "../../utils/constant";

const CardPropertyInspection = ({ propertyInspection, refresh }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onClickPropertyInspectionDetail = () => {
    navigate(
      `${staticPath.viewPropertyInspection + "/" + propertyInspection._id}`,
    );
  };
  return (
    <Card
      className="ticket-card"
      bodyStyle={{ padding: 10 }}
      style={{ margin: 5 }}
      onClick={onClickPropertyInspectionDetail}
    >
      <Row align="middle">
        <Col span={24} style={{ textAlign: "end" }}>
          <span
            className="ticket-status"
            style={{
              color:
                propertyInspectionStatus.Options.find(
                  (option) => option.value === propertyInspection?.status,
                )?.color || "#1677ff",
            }}
          >
            {t(
              parseToLabel(
                propertyInspectionStatus.Options,
                propertyInspection?.status,
              ),
            )}
          </span>
        </Col>
      </Row>

      <Row align="middle">
        <Col span={4}>
          <Image
            width={60}
            height={60}
            src={_unitOfWork.resource.getImage(
              propertyInspection?.assetMaintenance?.resource,
            )}
            preview={false}
            style={{ borderRadius: "5px", background: "#eee" }}
          />
        </Col>
        <Col span={20} style={{ paddingLeft: 10 }}>
          <Row gutter={32}>
            <Col span={24}>
              <b className="ticket-title ellipsis">
                {propertyInspection?.preventive?.preventiveName}
              </b>
            </Col>
            <Col span={24}>
              <span className="ellipsis">
                {t("propertyInspection.table.code")}
                {": "}
                {propertyInspection?.code}
              </span>
            </Col>
            <Col span={24}>
              <span>
                {
                  propertyInspection?.assetMaintenance?.assetModel?.asset
                    ?.assetName
                }{" "}
                |{" "}
                {
                  propertyInspection?.assetMaintenance?.assetModel
                    ?.assetModelName
                }{" "}
                |{" "}
                {propertyInspection?.assetMaintenance?.serial ||
                  propertyInspection?.assetMaintenance?.assetNumber}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider style={{ margin: "8px 0" }} />

      {/* Thông tin khách hàng và thời gian */}
      <Row>
        <Col span={12}>
          <div className="ellipsis">
            {t("schedulePreventive.card.user_label")}{" "}
            {propertyInspection?.assetMaintenance?.customer?.customerName}{" "}
          </div>
          <div className="ellipsis">
            {propertyInspection?.calibrationContract && (
              <>
                {" "}
                {t("calibration.contract")}
                {": "}
                {propertyInspection?.calibrationContract?.contractNo}
              </>
            )}
          </div>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <div>
            {t("schedulePreventive.card.open_date_label")}{" "}
            {parseDatetime(propertyInspection?.createdAt)}
          </div>
          <div style={{ color: "red" }}>
            {t("schedulePreventive.card.updated_date_label")}{" "}
            {parseDatetime(propertyInspection?.updatedAt)}
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CardPropertyInspection;
