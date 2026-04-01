import { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  FileTextOutlined,
  MessageOutlined,
  PhoneFilled,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Col, Image, message, Row, Tooltip, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import CardCalibrationWorkDetailAsset from "./CardCalibrationWorkDetailAsset";
import CalibrationWorkCommentDrawer from "../../components/Drawer/CalibrationWorkCommentDrawer";
import Comfirm from "../../components/modal/Comfirm";
import CloseCalibrationWorkModal from "../../components/modal/CloseCalibrationWorkModal";
import ReopenCalibrationWorkModal from "../../components/modal/ReopenCalibrationWorkModal";
import { calibrationWorkAssignUserStatus, calibrationWorkStatus } from "../../utils/calibration.constant";
import { staticPath } from "../../router/RouteConfig";
import ComfirmRejectModal from "../../components/modal/ComfirmRejectModal";
import ShowSuccess from "../../components/modal/result/successNotification";
import { parseToLabel } from "../../helper/parse-helper";
import { parseDateHH, parseDatetime } from "../../helper/date-helper";
import ComfirmLogoutModal from "../../components/modal/ComfirmLogoutModal";
import CalibratedComfirm from "../myCalibrationWork/CalibratedComfirm";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionCodeConstant";
import TechnicianAppoinment from "../../components/modal/TechnicianAppoinment";
import { progressStatus } from "../../utils/constant";
import ReplacementAssignUser from "../myBreakdown/ReplacementAssignUser";
const { Text } = Typography;

const CalibrationWorkDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [assetMaintenance, setAssetMaintenance] = useState(null);
  const [calibrationWork, setCalibrationWork] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [showComfirmCancel, setShowComfirmCancel] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const { permissions } = useAuth();
  const [calibrationWorkAssignUser, setCalibrationWorkAssignUser] = useState([]);
  const [showExpectedTimeModal, setShowExpectedTimeModal] = useState(false);
  const [selectedAssignUser, setSelectedAssignUser] = useState(null);
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const { user } = useAuth();
  const [currentCheckinCheckout, setCurrentCheckinCheckout] = useState(null);
  const [lastCheckInCheckOut, setLastCheckInCheckOut] = useState(null);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showStartWork, setShowStartWork] = useState(false);
  const [isOpenTechnicianAppoinment, setIsOpenTechnicianAppoinment] =
    useState(false);
  const [isOpenReplacement, setIsOpenReplacement] = useState(false);
  const [replacementAssignUser, setReplacementAssignUser] = useState([]);

  useEffect(() => {
    fetchCalibrationWork();
  }, []);

  const fetchCalibrationWork = async () => {
    let res = await _unitOfWork.calibrationWork.getCalibrationWorkById(
      params.id
    );
    if (res && res.code === 1) {
      setCalibrationWork(res?.calibrationWork);
      setAssetMaintenance(res?.calibrationWork?.assetMaintenance);
      setCalibrationWorkAssignUser(res?.calibrationWorkAssignUser);
      setLastCheckInCheckOut(res?.lastCheckInCheckOut);
    }
  };
  const onComfirmCancelCalibrationWork = async (data) => {
    let res =
      await _unitOfWork.calibrationWork.comfirmCancelCalibrationWorkById(
        params.id
      );
    if (res && res.code === 1) {
      message(t("common.messages.success.cancel"));
    }
    setShowComfirmCancel(false);
    onRefeshData();
  };
  const onClickAccept = (value) => {
    setSelectedAssignUser(value);
    setShowExpectedTimeModal(true);
  };
  const onCallbackRefuse = async (data) => {
    const payload = {
      calibrationWork: calibrationWorkAssignUser[0].calibrationWork,
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
      fetchCalibrationWork();
    }
    setOpenRejectModal(false);
    fetchCalibrationWork();
  };
  const showWork = () => {
    const statusNoWorks = [
      calibrationWorkAssignUserStatus.completed,
      calibrationWorkAssignUserStatus.cancelled,
      calibrationWorkAssignUserStatus.partiallyCompleted,
    ];
    if (statusNoWorks.includes(calibrationWorkAssignUser[0]?.status)) return false;
    if (!currentCheckinCheckout) return true;
    if (
      currentCheckinCheckout.calibrationWork.id ===
      calibrationWorkAssignUser[0]?.calibrationWork
    ) {
      return true;
    }
    return false;
  };
  const disabledLogin = () => !!currentCheckinCheckout;
  const onClickCheckIn = async () => {
    const payload = {
      calibrationWork:
        calibrationWorkAssignUser[0]?.calibrationWork,
    };
    let res = await _unitOfWork.calibrationWork.checkinCalibrationWork(payload);
    if (res && res.code === 1) {
      message.success(t("preventive.checkin.messages.success"));
      onRefeshData();
    }
  };
  const onRefeshData = () => {
    fetchCalibrationWork();
  };
  const onCallbackCheckOut = async (data) => {
    const payload = {
      calibrationWorkCheckinCheckOutId:
        currentCheckinCheckout?.id || currentCheckinCheckout?._id,
      comment: data?.comment,
      calibrationWork:
        calibrationWorkAssignUser[0]?.calibrationWork,
    };
    let res = await _unitOfWork.calibrationWork.checkOutCalibrationWork(
      payload
    );
    if (res && res.code === 1) {
      message.success(t("preventive.checkout.messages.success"));
      onRefeshData();
    }
    setShowCheckOutModal(false);
  };
  const onViewMyCalibrationWorkDetail = () => {
    navigate(
      staticPath.myCalibrationWorkDetail +
      "/" +
      currentCheckinCheckout?.calibrationWorkAssignUser
    );
    fetchCalibrationWork();
  };
  const onCallbackStartWork = () => {
    onRefeshData();
    setShowStartWork(false);
  };
  const onClickCancelStartWork = () => {
    setShowStartWork(false);
  };
  const onClickTechnicianAppoinment = () => {
    setIsOpenTechnicianAppoinment(true);
  };
  const callbackAssignUser = async (value, selectedRowKeys) => {
    const payload = {
      ...value,
      user: selectedRowKeys,
      calibrationWork: calibrationWork?.id,
    }
    const res = await _unitOfWork.calibrationWork.assignUserCalibrationWork(
      payload,
    );
    if (res && res.code === 1) {
      message.success(
        t("preventiveAssignUser.messages.assign_success", {
          defaultValue: "Chỉ định thành công!",
        })
      );
      fetchCalibrationWork();
    } else {
      message.error(
        t("preventiveAssignUser.messages.assign_error", {
          defaultValue: "Chỉ định thất bại!",
        })
      );
    }
  };
  const onClickReplacement = (value) => {
    setReplacementAssignUser(value);
    setIsOpenReplacement(true);
  };
  const callbackReplacementAssignUser = async (value, selectedRowKeys) => {
    const payload = {
      ...value,
      user: selectedRowKeys[0],
      oldUser: replacementAssignUser?.user?.id,
      calibrationWork: calibrationWork?.id,
    }
    const res = await _unitOfWork.calibrationWork.reassignmentCalibrationWorkAssignUser(
      payload,
    );
    if (res && res.code === 1) {
      message.success(
        t("preventiveAssignUser.messages.assign_success", {
          defaultValue: "Chỉ định thành công!",
        })
      );
      fetchCalibrationWork();
    } else {
      message.error(
        t("preventiveAssignUser.messages.assign_error", {
          defaultValue: "Chỉ định thất bại!",
        })
      );
    }
  };
  return (
    <div style={{ background: "#f8f8f8" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 60,
          background: "#23457b",
          color: "#fff",
          padding: "0 16px",
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <ArrowLeftOutlined
            style={{ fontSize: 20, marginRight: 16, cursor: "pointer" }}
            onClick={() => navigate(-1)}
          />
        </div>
        <div>
          {t("preventive.pdf.schedule_id")}: {calibrationWork?.code}
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Tooltip title={t("preventive.history.title")}>
            <FileTextOutlined
              style={{ fontSize: 25, cursor: "pointer" }}
              onClick={() => navigate(`${staticPath.workDiaryCW}/${calibrationWork.id}`)}
            />
          </Tooltip>
          <Tooltip title={t("assetMaintenance.detail.history")}>
            <ClockCircleOutlined
              style={{ fontSize: 25, cursor: "pointer" }}
              onClick={() => navigate(`${staticPath.calibrationHistory}/${calibrationWork.id}`)}
            />
          </Tooltip>
          {calibrationWork?.status === calibrationWorkStatus.new && (
            <Tooltip title={t("preventiveAssignUser.cancel")}>
              <CloseOutlined
                style={{ fontSize: 25, cursor: "pointer" }}
                onClick={() =>
                  Comfirm(
                    t(
                      "calibrationWork.confirm_cancellation_of_calibration_job"
                    ),
                    () => onComfirmCancelCalibrationWork()
                  )
                }
              />
            </Tooltip>
          )}
        </div>
      </div>

      <div style={{ background: "#23457b", color: "#fff", padding: 10 }}>
        <Row align="middle" gutter={16}>
          <Col span={4}>
            <div
              style={{
                width: "100%",
                borderRadius: "50%",
                background: "#e5e5e5",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                width={"90%"}
                height={"90%"}
                preview={false}
                src={_unitOfWork.resource.getImage(
                  assetMaintenance?.resource?.id
                )}
                style={{ objectFit: "cover", background: "#eee" }}
              />
            </div>
          </Col>
          <Col flex="auto" span={18}>
            <Row justify="space-between">
              <Col>
                <Text strong style={{ color: "#fff", fontSize: 16 }}>
                  {assetMaintenance?.assetModel?.asset?.assetName} |{" "}
                  {assetMaintenance?.assetModel?.assetModelName} |{" "}
                  {assetMaintenance?.serial || assetMaintenance?.assetNumber}
                </Text>
              </Col>
              <Col span={24}>
                <Text strong style={{ color: "#FF4D4F", fontSize: 14 }}>
                  {t(
                    parseToLabel(
                      calibrationWorkAssignUserStatus.Options,
                      calibrationWorkAssignUser[0]?.status
                    )
                  )}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {checkPermission(
        permissions,
        permissionCodeConstant.calibration_work_assign
      ) &&
        calibrationWorkAssignUser.length === 0 && (
          <Col span={24} style={{ textAlign: "center", paddingTop: 8 }}>
            <button
              onClick={() => onClickTechnicianAppoinment()}
              style={{
                background: "#2ec6e9",
                color: "#fff",
                width: "60%",
                border: "none",
                borderRadius: 40,
                padding: "8px 10px",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {t("breakdown.view.menu.assign_technician")}
            </button>
          </Col>
        )}
      {calibrationWork?.status ===
        calibrationWorkStatus.waitingForAdminApproval && (
          <div>
            <Col span={24} style={{ textAlign: "center", paddingTop: 8 }}>
              <button
                type="primary"
                onClick={() => setShowCloseModal(true)}
                style={{
                  background: "#2ec6e9",
                  color: "#fff",
                  width: "60%",
                  border: "none",
                  borderRadius: 40,
                  padding: "8px 10px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t("breakdown.close.buttons.submit")}
              </button>
            </Col>
            <Col span={24} style={{ textAlign: "center", paddingTop: 8 }}>
              <button
                onClick={() => setShowReopenModal(true)}
                style={{
                  background: "red",
                  color: "#fff",
                  width: "60%",
                  border: "none",
                  borderRadius: 40,
                  padding: "8px 10px",
                  fontWeight: 600,
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t("breakdown.reopen.buttons.submit")}
              </button>
            </Col>
          </div>
        )}
      {calibrationWorkAssignUser &&
        calibrationWorkAssignUser.length > 0 && (
          <div style={{ padding: "10px" }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>
              {t("breakdown.view.menu.service_technicians")}
            </div>
            <Row>
              {calibrationWorkAssignUser.map((u, idx) => (
                <Col span={24} key={idx}>
                  <div
                    style={{
                      background: "#f5f5f7",
                      minHeight: 100,
                      cursor: "pointer",
                      padding: "10px 0px",
                      borderBottom:
                        idx === calibrationWorkAssignUser.length - 1
                          ? "none"
                          : "1px solid #bdbdbd",
                    }}
                  >
                    <Row align="middle">
                      <Col
                        span={5}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: "50%",
                            background: "#eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            border: "2px solid #e0e0e0",
                          }}
                        >
                          <Avatar
                            size={60}
                            style={{ backgroundColor: "#87d068" }}
                            icon={<UserOutlined />}
                          />
                        </div>
                      </Col>
                      <Col span={17}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 16,
                            marginBottom: 4,
                          }}
                        >
                          {u.user?.fullName ||
                            u.user?.username ||
                            t("breakdown.view.menu.no_technician")}
                        </div>
                        <div>
                          {t("breakdown.view.menu.status")} :{" "}
                          <span
                            style={{
                              fontWeight: 600,
                              color:
                                progressStatus.Option.find(
                                  (opt) => opt.value === u.status
                                )?.color || "#000000",
                            }}
                          >
                            {t(
                              progressStatus.Option.find(
                                (p) => p.value === u.status
                              )?.label
                            )}
                          </span>
                        </div>
                        {u?.estimatedCompletionDate && (
                          <div style={{ color: "#888", fontSize: 14 }}>
                            {t("breakdown.view.menu.planned_finish")}{" "}
                            {parseDateHH(u?.estimatedCompletionDate)}
                          </div>
                        )}
                        {u?.repairContract && (
                          <div style={{ color: "#888", fontSize: 14 }}>
                            {t("menu.settings.contract")}{" "}
                            {u?.repairContract?.contractNo}
                          </div>
                        )}
                      </Col>
                      <Col
                        span={2}
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: 20,
                          fontWeight: 600,
                          paddingRight: "10px",
                        }}
                      >
                        <a
                          href={`tel:${u.user?.contactNo || ""}`}
                          style={{ textDecoration: "none" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <PhoneFilled style={{ color: "#10426d" }} />
                        </a>
                      </Col>
                      {checkPermission(
                        permissions,
                        permissionCodeConstant.calibration_assign
                      ) &&
                        u.status !== calibrationWorkAssignUserStatus.replacement &&
                        u.status !== calibrationWorkAssignUserStatus.cancelled &&
                        u.status !== calibrationWorkAssignUserStatus.completed && (
                          <Col span={24}>
                            <button
                              onClick={() => onClickReplacement(u)}
                              className="ml-2 mt-2"
                              style={{
                                background: "#2ec6e9",
                                color: "#fff",
                                width: "40%",
                                border: "none",
                                borderRadius: 10,
                                padding: "8px 10px",
                                fontWeight: 600,
                                fontSize: 16,
                                cursor: "pointer",
                              }}
                            >
                              {t("breakdown.view.menu.reassign")}
                            </button>
                          </Col>
                        )}
                    </Row>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      <CardCalibrationWorkDetailAsset
        calibrationWork={calibrationWork}
        assetMaintenance={assetMaintenance}
      />
      <div
        style={{
          position: "fixed",
          bottom: 100,
          right: 20,
          zIndex: 1000,
        }}
      >
        <Button
          type="primary"
          shape="circle"
          icon={<MessageOutlined style={{ fontSize: 26 }} />}
          style={{
            width: 64,
            height: 64,
            border: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
          onClick={() => {
            setShowComment(true);
          }}
        />
      </div>
      <CalibrationWorkCommentDrawer
        open={showComment}
        onClose={() => setShowComment(false)}
        calibrationWork={calibrationWork}
      />
      <CloseCalibrationWorkModal
        open={showCloseModal}
        onClose={() => setShowCloseModal(false)}
        calibrationWork={calibrationWork}
        onRefresh={fetchCalibrationWork}
      />
      <ReopenCalibrationWorkModal
        open={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        calibrationWork={calibrationWork}
        onRefresh={fetchCalibrationWork}
      />
      <ComfirmRejectModal
        open={openRejectModal}
        onCallback={onCallbackRefuse}
        onCancel={() => setOpenRejectModal(false)}
      />
      <ComfirmLogoutModal
        open={showCheckOutModal}
        onCancel={() => setShowCheckOutModal(false)}
        onCallback={onCallbackCheckOut}
      />
      <CalibratedComfirm
        onCallback={onCallbackStartWork}
        open={showStartWork}
        calibrationWorkAssignUser={calibrationWorkAssignUser[0]}
        handleCancel={onClickCancelStartWork}
      />
      <TechnicianAppoinment
        open={isOpenTechnicianAppoinment}
        onClose={() => setIsOpenTechnicianAppoinment(false)}
        onReFeshFilter={fetchCalibrationWork}
        callbackAssignUser={callbackAssignUser}
      />
      <ReplacementAssignUser
        open={isOpenReplacement}
        onClose={() => setIsOpenReplacement(false)}
        onReFeshFilter={fetchCalibrationWork}
        callbackAssignUser={callbackReplacementAssignUser}
      />
    </div>
  );
};

export default CalibrationWorkDetail;
