import {
  CheckOutlined,
  CloseOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row } from "antd";
import { staticPath } from "../../router/RouteConfig";
import { useNavigate } from "react-router-dom";
import { parseToLabel } from "../../helper/parse-helper";
import { schedulePreventiveStatus } from "../../utils/schedulePreventive.constant";
import { parseDatetime } from "../../helper/date-helper";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionCodeConstant";
import { useTranslation } from "react-i18next";
import { calibrationWorkAssignUserStatus, calibrationWorkStatus } from "../../utils/calibration.constant";
import ShowSuccess from "../../components/modal/result/successNotification";
import ComfirmRejectModal from "../../components/modal/ComfirmRejectModal";
import { useState } from "react";

const CardCalibrationWork = ({ schedulePreventive, refresh }) => {
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const { t } = useTranslation();
  const [
    showRefuseSchedulePreventiveTask,
    setShowRefuseSchedulePreventiveTask,
  ] = useState(null);
  const onClickSchedulePreventiveDetail = () => {
    // if (
    //   checkPermission(
    //     permissions,
    //     permissionCodeConstant.schedule_preventive_view_detail
    //   )
    // )
    navigate(
      `${staticPath.calibrationWorkDetail + "/" + schedulePreventive._id}`
    );
  };
  const showButtonConfirmAndCancelAssignUser = () => {
    console.log(schedulePreventive.status);
    if (
      schedulePreventive &&
      schedulePreventive.status ===
      calibrationWorkAssignUserStatus.assigned
    ) {
      return true;
    } else {
      return false;
    }
  };
  const onConfirmAssignUser = async () => {
    const payload = {
      calibrationWork: schedulePreventive.calibrationWork._id,
    };
    console.log(payload);
    let res = await _unitOfWork.calibrationWork.comfirmAcceptCalibrationWork(
      payload
    );
    if (res && res.code === 1) {
      ShowSuccess("topRight", t("notification.notification"), t("Chấp nhận thành công"));
      refresh();
    }
  };
  const onCallbackRefuse = async (data) => {
    const payload = {
      calibrationWork: schedulePreventive.calibrationWork._id,
      reasonsForRefusal: data.comment,
    };
    let res = await _unitOfWork.calibrationWork.comfirmRejectCalibrationWork(
      payload
    );
    if (res && res.code === 1) {
      ShowSuccess(
        "topRight",
        t("notification.notification"),
        t("Đã từ chối công việc thành công")
      );
      refresh();
    }
    setShowRefuseSchedulePreventiveTask(false);
    refresh();
  };
  return (
    <Card
      className="ticket-card"
      bodyStyle={{ padding: 10 }}
      style={{ margin: 5 }}
      onClick={onClickSchedulePreventiveDetail}
    >
      <Row align="middle">
        <Col span={24} style={{ textAlign: "end" }}>
          <span
            className="ticket-status"
            style={{
              color:
                calibrationWorkStatus.Options.find(
                  (option) => option.value === schedulePreventive?.status
                )?.color || "#1677ff",
            }}
          >
            {t(
              parseToLabel(
                calibrationWorkStatus.Options,
                schedulePreventive?.status
              )
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
              schedulePreventive?.assetMaintenance?.resource
            )}
            preview={false}
            style={{ borderRadius: "5px", background: "#eee" }}
          />
        </Col>
        <Col span={20} style={{ paddingLeft: 10 }}>
          <Row gutter={32}>
            <Col span={24}>
              <b className="ticket-title ellipsis">
                {schedulePreventive?.preventive?.preventiveName}
              </b>
            </Col>
            <Col span={24}>
              <span className="ellipsis">
                {t("schedulePreventive.card.schedule_id_label")}{" "}
                {schedulePreventive?.code}
              </span>
            </Col>
            <Col span={24}>
              <span>
                {
                  schedulePreventive?.assetMaintenance?.assetModel?.asset
                    ?.assetName
                }{" "}
                |{" "}
                {
                  schedulePreventive?.assetMaintenance?.assetModel
                    ?.assetModelName
                }{" "}
                |{" "}
                {schedulePreventive?.assetMaintenance?.serial ||
                  schedulePreventive?.assetMaintenance?.assetNumber}
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
            {schedulePreventive?.assetMaintenance?.customer?.customerName}{" "}
          </div>
          <div className="ellipsis">
            {schedulePreventive?.calibrationContract && (
              <>
                {" "}
                {t("calibration.contract")}
                {": "}
                {schedulePreventive?.calibrationContract?.contractNo}
              </>
            )}
          </div>
        </Col>
        <Col span={12} style={{ textAlign: "end" }}>
          <div>
            {t("schedulePreventive.card.open_date_label")}{" "}
            {parseDatetime(schedulePreventive?.createdAt)}
          </div>
          <div style={{ color: "red" }}>
            {t("schedulePreventive.card.updated_date_label")}{" "}
            {parseDatetime(schedulePreventive?.updatedAt)}
          </div>
        </Col>
      </Row>
      {showButtonConfirmAndCancelAssignUser() && (
        <Row
          justify="space-around"
          className="ticket-actions"
          style={{ marginTop: 12 }}
        >
          <>
            {checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_my_task_accept
            ) && (
                <Button
                  icon={<CheckOutlined style={{ color: "blue" }} />}
                  onClick={onConfirmAssignUser}
                  className="btn-breakdown"
                >
                  {t("schedulePreventive.card.accept_button")}
                </Button>
              )}
            {checkPermission(
              permissions,
              permissionCodeConstant.schedule_preventive_my_task_rejected
            ) && (
                <Button
                  icon={<CloseOutlined style={{ color: "red" }} />}
                  className="btn-breakdown"
                  onClick={() => setShowRefuseSchedulePreventiveTask(true)}
                >
                  {t("schedulePreventive.card.reject_button")}
                </Button>
              )}
          </>
        </Row>
      )}
      <ComfirmRejectModal
        open={showRefuseSchedulePreventiveTask}
        onCallback={onCallbackRefuse}
        onCancel={() => setShowRefuseSchedulePreventiveTask(false)}
      />
    </Card>
  );
};

export default CardCalibrationWork;
