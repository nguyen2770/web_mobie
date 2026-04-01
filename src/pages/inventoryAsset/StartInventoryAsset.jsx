import { ArrowLeftOutlined, QrcodeOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Image,
  Row,
  Typography,
  Tabs,
  Divider,
  Card,
  Modal,
  notification,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { socket } from "../../services/socket";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { parseToLabel } from "../../helper/parse-helper";
import "./index.scss";
import { parseDate, parseDatetime } from "../../helper/date-helper";
import { staticPath } from "../../router/RouteConfig";
import { useTranslation } from "react-i18next";
import QrCodeScan from "../../components/qrCodeScan";
import useAuth from "../../contexts/authContext";
import {
  inventoryAssetDepartmentAssetMaintenanceStatus,
  inventoryAssetDepartmentStatus,
} from "../../utils/inventoryAssetConstant";
import { parseQuery } from "../../helper/queryString-helper";
import DrawerAssetMaintenanceInfo from "./DrawerAssetMaintenanceInfo";
import DrawerDetailAssetMaintenances from "./DrawerDetailAssetMaintenances";

const { Text } = Typography;
const { TabPane } = Tabs;

const StartInventoryAsset = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = useParams();
  const [inventoryAsset, setInventoryAsset] = useState(null);
  const [inventoryAssetDepartment, setInventoryAssetDepartment] =
    useState(null);
  const [assetMaintenanceId, setAssetMaintenanceId] = useState(null);
  const [showQrCodeScan, setShowQrCodeScan] = useState(false);
  const [inventoryAssetDepartmentId, setInventoryAssetDepartmentId] = useState(
    params.id,
  );
  const [showDrawerAssetMaintenanceInfo, setShowDrawerAssetMaintenanceInfo] =
    useState(false);
  const [showDetailAssetMaintenances, setShowDrawerAssetMaintenances] =
    useState(false);
  const [groupDetail, setGroupDetail] = useState(null);
  const [
    inventoryAssetDepartmentAssetMaintenances,
    setInventoryAssetDepartmentAssetMaintenances,
  ] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    fetchInventoryAssetDepartment();
  }, []);
  useEffect(() => {
    const workOrderId = inventoryAssetDepartmentId;

    if (workOrderId) {
      const joinRoom = () => {
        socket.emit("join", workOrderId);
      };

      if (socket.connected) {
        joinRoom();
      } else {
        socket.once("connect", joinRoom);
      }

      // Socket event handler
      const handleOneQACompleted = (data) => {
        fetchInventoryAssetDepartment();
      };

      socket.on("scanQrCode:completed", handleOneQACompleted);

      // Handle connection errors
      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      // Cleanup
      return () => {
        console.log("Cleaning up socket listeners for room:", "123");
        socket.off("oneqa:completed", handleOneQACompleted);
        socket.off("connect_error");
      };
    }
  }, [inventoryAssetDepartmentId]);

  const fetchInventoryAssetDepartment = async () => {
    const res =
      await _unitOfWork.inventoryAsset.getInventoryAssetDepartmentById({
        id: params.id,
      });
    if (res && res.data) {
      setInventoryAsset(res.data.inventoryAsset);
      setInventoryAssetDepartment(res.data.inventoryAssetDepartment);
      setInventoryAssetDepartmentAssetMaintenances(
        res.data.inventoryAssetDepartmentAssetMaintenances.filter(
          (f) =>
            f.status !==
            inventoryAssetDepartmentAssetMaintenanceStatus.not_yet_inventoried,
        ),
      );
    }
  };
  const groupAssetMaintenance = () => {
    let groups = [];
    inventoryAssetDepartmentAssetMaintenances.forEach((item) => {
      var _idx = groups.findIndex(
        (g) =>
          g?.asset?.id === item?.asset?.id &&
          g?.assetModel?.id === item?.assetModel?.id,
      );
      if (_idx > -1) {
        groups[_idx].quantity += 1;
        groups[_idx].assetMaintenances.push(item);
      } else {
        groups.push({
          quantity: 1,
          asset: item.asset,
          assetModel: item.assetModel,
          assetMaintenances: [item],
        });
      }
    });
    return groups;
  };
  const onClickShowQrCodeScan = () => {
    setShowQrCodeScan(!showQrCodeScan);
  };
  const onCliclDetailAssetMaintenances = (_group) => {
    setGroupDetail(_group);
    setShowDrawerAssetMaintenances(true);
  };
  const onCloseDetailAssetMaintenances = () => {
    setShowDrawerAssetMaintenances(false);
    setGroupDetail(null);
  };
  const onCallback = (dataQrcode) => {
    let query = parseQuery(dataQrcode);
    var _amId = query["assetMaintenance"];
    setAssetMaintenanceId(_amId);
    if (_amId) {
      setShowQrCodeScan(false);
      setShowDrawerAssetMaintenanceInfo(true);
    }
  };
  const onCloseShowAssetMaintenanceInfo = () => {
    setAssetMaintenanceId(null);
    setShowQrCodeScan(true);
    setShowDrawerAssetMaintenanceInfo(false);
  };
  const onSaveAssetMaintenance = async (_assetMaintenance) => {
    if (!_assetMaintenance) {
      notification.error({
        message: "Thông báo",
        description: "Không tìm thấy thiết bị!",
      });
      return;
    }
    // tìm xem đã tồn tại hay chưa
    var amFind = inventoryAssetDepartmentAssetMaintenances.find(
      (am) => am.assetMaintenance?.id === _assetMaintenance.id,
    );
    if (amFind) {
      notification.error({
        message: "Thông báo",
        description: "Thiết bị đã được kiểm kê!",
      });
    } else {
      let inventoryAssetDepartmentAssetMaintenance = {
        assetMaintenance: _assetMaintenance,
        assetModel: _assetMaintenance.assetModel,
        asset: _assetMaintenance.asset,
      };
      let res = await _unitOfWork.inventoryAsset.scanRealtime({
        inventoryAssetDepartmentId: params.id,
        inventoryAssetDepartmentAssetMaintenance:
          inventoryAssetDepartmentAssetMaintenance,
      });
      if (res && res.code === 1) {
        fetchInventoryAssetDepartment();
      }
      setAssetMaintenanceId(null);
      setShowQrCodeScan(true);
      setShowDrawerAssetMaintenanceInfo(false);
    }
  };
  const confirmInventoryAssetDepartment = async () => {
    let res = await _unitOfWork.inventoryAsset.confirmInventoryAssetDepartment({
      id: params.id,
    });
    if (res && res.code === 1) {
      fetchInventoryAssetDepartment();
    }
  };
  const sendAssetMaintenances = async () => {
    let res = await _unitOfWork.inventoryAsset.sendAssetMaintenances({
      inventoryAssetDepartment,
      inventoryAssetDepartmentAssetMaintenances,
    });
    if (res && res.code === 1) {
      fetchInventoryAssetDepartment();
    }
  };
  return (
    <>
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
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
          style={{ fontSize: 20, marginRight: 16, cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <span style={{ flex: 1 }}>Bắt đầu kiểm kê</span>
        <div className="icon-right-header-create-ticket">
          <QrcodeOutlined
            onClick={onClickShowQrCodeScan}
            style={{ fontSize: 28 }}
          />
        </div>
      </div>

      {/* Thông tin đầu trang */}
      <div>
        <Row style={{ padding: 16 }} align="middle">
          <Col span={24} className="mb-1">
            <b className="ticket-title ellipsis">{inventoryAsset?.title}</b>
          </Col>
          <Col span={24} className="mb-1">
            <div className="d-flex justify-space-between">
              <div>Ngày bắt đầu:</div>
              <div>
                {" "}
                <b>{parseDate(inventoryAsset?.startDate)}</b>
              </div>
            </div>
          </Col>
          <Col span={24} className="mb-1">
            <div className="d-flex justify-space-between">
              <div>Ngày kết thúc:</div>
              <div>
                {" "}
                <b>{parseDate(inventoryAsset?.endDate)}</b>
              </div>
            </div>
          </Col>
          <Col span={24} className="mb-1">
            <div className="d-flex justify-space-between">
              <div>Phòng ban:</div>
              <div>
                {" "}
                <b>{inventoryAssetDepartment?.department?.departmentName}</b>
              </div>
            </div>
          </Col>
          {/* <Col span={24} className="mb-1">
                        <div className="d-flex justify-space-between">
                            <div>Người kiểm kê:</div>
                            <div> <b>{inventoryAssetDepartment?.user?.fullName}</b></div>
                        </div>
                    </Col> */}
          <Col span={24} className="mb-1">
            <div className="d-flex justify-space-between">
              <div>Trạng thái kiểm kê:</div>
              <div
                className={
                  "inventory-asset-department-status-" +
                  inventoryAssetDepartment?.status
                }
              >
                {parseToLabel(
                  inventoryAssetDepartmentStatus.Options,
                  inventoryAssetDepartment?.status,
                )}
              </div>
            </div>
          </Col>
        </Row>
        <Divider>Danh sách thiết bị/tài sản</Divider>
        <Row className="pl-2 pr-2">
          {groupAssetMaintenance().map((_item) => {
            return (
              <Card
                className="mb-2 wp-100"
                onClick={() => onCliclDetailAssetMaintenances(_item)}
              >
                <Row>
                  <Col span={24}>
                    <div className="d-flex justify-space-between">
                      <div style={{ width: "30%" }}>Tên thiết bị:</div>
                      <div style={{ width: "70%", textAlign: "right" }}>
                        {" "}
                        <b>{_item?.asset?.assetName}</b>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="d-flex justify-space-between">
                      <div style={{ width: "30%" }}>Model:</div>
                      <div>
                        {" "}
                        <b>{_item?.assetModel?.assetModelName}</b>
                      </div>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="d-flex justify-space-between">
                      <div style={{ width: "30%" }}>Số lượng:</div>
                      <div>
                        {" "}
                        <b>{_item?.quantity}</b>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            );
          })}
        </Row>
        {/* {showQrCodeScan && <QrCodeScan onCallback={onCallback} />} */}
        {inventoryAssetDepartment?.status ===
          inventoryAssetDepartmentStatus.assigned && (
          <div className="d-flex pl-3 pr-3">
            <Button
              type="primary"
              className="mr-2"
              block
              size="large"
              onClick={confirmInventoryAssetDepartment}
            >
              Xác nhận kiểm kê
            </Button>
            <Button block className="ml-2" size="large">
              Hủy bỏ
            </Button>
          </div>
        )}
        {(inventoryAssetDepartment?.status ===
          inventoryAssetDepartmentStatus.inProgress ||
          inventoryAssetDepartment?.status ===
            inventoryAssetDepartmentStatus.accepted) && (
          <div className="d-flex pl-3 pr-3">
            <Button
              className="ml-5 mr-5"
              type="primary"
              block
              size="large"
              onClick={sendAssetMaintenances}
            >
              Gửi danh sách kiểm kê
            </Button>
          </div>
        )}
      </div>
      {/* Modal show camera scan */}
      <Modal
        visible={showQrCodeScan}
        footer={[<Button onClick={onClickShowQrCodeScan}>Hủy bỏ</Button>]}
      >
        <QrCodeScan onCallback={onCallback} />
      </Modal>
      <DrawerAssetMaintenanceInfo
        onSaveAssetMaintenance={onSaveAssetMaintenance}
        onClose={onCloseShowAssetMaintenanceInfo}
        assetMaintenanceId={assetMaintenanceId}
        open={showDrawerAssetMaintenanceInfo}
      />
      <DrawerDetailAssetMaintenances
        onReload={fetchInventoryAssetDepartment}
        open={showDetailAssetMaintenances}
        group={groupDetail}
        onClose={onCloseDetailAssetMaintenances}
        inventoryAssetDepartmentAssetMaintenances={
          inventoryAssetDepartmentAssetMaintenances
        }
      />
    </>
  );
};

export default StartInventoryAsset;
