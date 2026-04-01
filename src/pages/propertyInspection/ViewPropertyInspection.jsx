import { useEffect, useState } from "react";
import {
  ArrowLeftOutlined,
  CloseOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";
import { Card, Checkbox, Col, Image, List, Row, Tooltip, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import Comfirm from "../../components/modal/Comfirm";
import ShowSuccess from "../../components/modal/result/successNotification";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionCodeConstant";
import { propertyInspectionStatus } from "../../utils/constant";
import CardPropertyInspectionAssetDetail from "./CardPropertyInspectionAssetDetail";
import { staticPath } from "../../router/RouteConfig";
import PropertyInspectionAttachment from "./PropertyInspectionAttachment";
const { Text } = Typography;

const ViewPropertyInspection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const { permissions } = useAuth();
  const [propertyInspection, setPropertyInspection] = useState({});
  const [propertyInspectionTasks, setPropertyInspectionTasks] = useState([]);
  const [assetMaintenanceAttachments, setAssetMaintenanceAttachments] = useState([]);
  const [isOpenTabAttachment, setIsOpenTabAttachment] = useState(false);

  useEffect(() => {
    fetchGetPropertyInspection();
  }, []);

  const fetchGetPropertyInspection = async () => {
    let res = await _unitOfWork.propertyInspection.getPropertyInspectionById(
      params.id
    );
    if (res && res.code === 1) {
      setPropertyInspection(res?.propertyInspection);
      setPropertyInspectionTasks(res?.propertyInspectionTasks);
      setAssetMaintenanceAttachments(res?.assetMaintenanceAttachments);
    }
  };
  const onClickComfirmCancel = async () => {
    let res = await _unitOfWork.propertyInspection.cancelPropertyInspection({
      id: propertyInspection?._id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRinght",
        t("common.notifications"),
        t("propertyInspection.noti_cancel_property_inspection"),
      );
      fetchGetPropertyInspection();
    }
  };
  const onClickClose = async () => {
    let res = await _unitOfWork.propertyInspection.closePropertyInspection({
      id: propertyInspection?._id,
    });
    if (res && res.code === 1) {
      ShowSuccess(
        "topRinght",
        t("common.notifications"),
        t("propertyInspection.noti_colse_property_inspection"),
      );
      fetchGetPropertyInspection();
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
          {t("propertyInspection.code")}: {propertyInspection?.code}
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Tooltip> {/* title={t("breakdown.view.menu.attachments")} */}
            <PaperClipOutlined
              style={{ fontSize: 25, cursor: "pointer" }}
              onClick={() =>
                setIsOpenTabAttachment(true)
              }
            />
          </Tooltip>
          {checkPermission(
            permissions,
            permissionCodeConstant.property_inspection_cancel
          ) &&
            (propertyInspection?.status === propertyInspectionStatus.waitingForAdminApproval ||
              propertyInspection?.status === propertyInspectionStatus.partiallyCompleted) && (
              <Tooltip title={t("preventiveSchedule.buttons.cancel")}>
                <CloseOutlined
                  style={{ fontSize: 25, cursor: "pointer" }}
                  onClick={() =>
                    Comfirm(
                      `${t("propertyInspection.cancel_property_inspection")}?`,
                      () => onClickComfirmCancel()
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
                  propertyInspection?.assetMaintenance?.resource?.id
                )}
                style={{ objectFit: "cover", background: "#eee" }}
              />
            </div>
          </Col>
          <Col flex="auto" span={18}>
            <Row justify="space-between">
              <Col>
                <Text strong style={{ color: "#fff", fontSize: 16 }}>
                  {propertyInspection?.assetMaintenance?.assetModel?.asset?.assetName} |{" "}
                  {propertyInspection?.assetMaintenance?.assetModel?.assetModelName} |{" "}
                  {propertyInspection?.assetMaintenance?.serial || propertyInspection?.assetMaintenance?.assetNumber}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {checkPermission(
        permissions,
        permissionCodeConstant.property_inspection_close
      ) &&
        propertyInspection?.status === propertyInspectionStatus.waitingForAdminApproval && (
          <>
            <Col span={24} style={{ textAlign: "center", paddingTop: 8 }}>
              <button
                onClick={() =>
                  Comfirm(
                    `${t("propertyInspection.colse_property_inspection")}?`,
                    () => onClickClose(),
                  )
                }
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
          </>
        )}
      <div
        style={{ fontWeight: 600, fontSize: 18, margin: "24px 0 12px 20px" }}
      >
        {t("propertyInspection.checklist")}
      </div>
      <div>
        {/* {propertyInspectionTasks?.map((task, _idx) => (
          <Card
            title={t("propertyInspection.table.content")}
            className="card-schedule-preventive-task"
            style={{ margin: 10 }}
            bodyStyle={{ padding: "10px 20px" }}
            extra={
              <Checkbox
                checked={task.status}
              >
                {task.status === true ? (
                  <>
                    {t("breakdown.ticketStatusTabs.completed")}
                  </>
                ) : (
                  <>
                    {t("breakdown.requestSupport.options.incomplete")}
                  </>
                )
                }
              </Checkbox>
            }
          >
            <Text style={{ fontSize: 16 }}>
              {`${task?.content}`}

            </Text>
          </Card>
        ))} */}
        <List
          style={{
            background: "#fff",
            margin: "0 12px 18px 12px",
            padding: "10px 0",
            boxShadow: "0 1px 6px #0001",
            borderRadius: "8px"
          }}
          dataSource={propertyInspectionTasks}
          renderItem={(task) => (
            <List.Item
              key={task.id}
              style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column' }}
            >
              <Text style={{ fontSize: 15, color: '#333', lineHeight: '1.4', alignSelf: 'flex-start' }}>
                {task?.content}
              </Text>
              <Text style={{ alignSelf: 'flex-end' }}>
                <Checkbox checked={task.status}>
                  {task.status
                    ? t("breakdown.ticketStatusTabs.completed")
                    : t("breakdown.requestSupport.options.incomplete")
                  }
                </Checkbox>
              </Text>
            </List.Item>
          )}
        />
      </div>
      <CardPropertyInspectionAssetDetail
        propertyInspection={propertyInspection}
      />
      <PropertyInspectionAttachment
        open={isOpenTabAttachment}
        onClose={() => setIsOpenTabAttachment(false)}
        listDocuments={assetMaintenanceAttachments}
      />
    </div>
  );
};

export default ViewPropertyInspection;
