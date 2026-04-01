import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Image, Row, Typography, Tabs, Divider, Card } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { parseToLabel } from "../../helper/parse-helper";
import './index.scss'
import { parseDate, parseDatetime } from "../../helper/date-helper";
import { staticPath } from "../../router/RouteConfig";
import { useTranslation } from "react-i18next";
import useAuth from "../../contexts/authContext";
import { inventoryAssetDepartmentStatus, inventoryAssetStatus } from "../../utils/inventoryAssetConstant";

const { Text } = Typography;
const { TabPane } = Tabs;

const ViewInventoryAsset = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [inventoryAsset, setInventoryAsset] = useState();;
    const [inventoryAssetDepartments, setInventoryAssetDepartments] = useState([]);
    const params = useParams();
    const { t } = useTranslation();

    useEffect(() => {
        fetchInventoryAsset();
    }, []);


    const fetchInventoryAsset = async () => {
        const res = await _unitOfWork.inventoryAsset.getInventoryAssetById({
            id: params.id,
        });
        if (res && res.data) {
            setInventoryAsset(res.data.inventoryAsset);
            setInventoryAssetDepartments(res.data.inventoryAssetDepartments.filter(f => f.users.find(u => u === user.id)));
        }
    };
    const goToStartInventory = (_inventoryAssetDepartment) => {
        navigate(staticPath.startInventoryAsset + "/" + _inventoryAssetDepartment._id);
    }
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
                Lịch kiểm kê
            </div>

            {/* Thông tin đầu trang */}
            <div style={{ padding: 16 }}>
                <Row gutter={16} align="middle">
                    <Row>
                        <Col span={24}>
                            <b className="ticket-title ellipsis">{inventoryAsset?.title}</b>
                        </Col>

                        <Col span={24}>
                            <div className="d-flex justify-space-between">
                                <div>Ngày bắt đầu:</div>
                                <div> <b>{parseDate(inventoryAsset?.startDate)}</b></div>
                            </div>
                        </Col>

                        <Col span={24}>
                            <div className="d-flex justify-space-between">
                                <div>Ngày kết thúc:</div>
                                <div> <b>{parseDate(inventoryAsset?.endDate)}</b></div>
                            </div>
                        </Col>
                        <Col span={24} className="mb-1">
                            <div className="d-flex justify-space-between">
                                <div>Trạng thái kiểm kê:</div>
                                <div className={"inventory-asset-status-" + inventoryAsset?.status}>{parseToLabel(inventoryAssetStatus.Options, inventoryAsset?.status)}</div>
                            </div>
                        </Col>
                    </Row>
                </Row>
                <Divider>Danh sách khoa/phòng của bạn</Divider>
                {
                    inventoryAssetDepartments && inventoryAssetDepartments.length > 0 &&
                    inventoryAssetDepartments.map(_item => {
                        return <Card
                            key={_item?.id}
                            bodyStyle={{ padding: 10 }}
                            style={{ margin: 5 }}
                            onClick={() => goToStartInventory(_item)}
                        >
                            <Row align="middle" >
                                <Col span={24}>
                                    <b className="ticket-title ellipsis">{_item?.departmentName}</b>
                                </Col>

                                <Col span={24}>
                                    <div className="d-flex justify-space-between">
                                        <div>Trạng thái kiểm kê:</div>
                                        <div className={"inventory-asset-department-status-" + _item.status}>{parseToLabel(inventoryAssetDepartmentStatus.Options, _item.status)}</div>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    })
                }
            </div>
        </>
    );
};

export default ViewInventoryAsset;