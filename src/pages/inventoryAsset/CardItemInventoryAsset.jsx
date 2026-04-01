import { Button, Card, Col, Divider, Image, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../router/RouteConfig";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionCodeConstant";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import './index.scss'
import { parseDate } from "../../helper/date-helper";
const CardItemInventoryAsset = ({
    onClickItem,
    inventoryAsset,
}) => {
    const navigate = useNavigate();
    const { permissions } = useAuth();
    const { t } = useTranslation();
    const onClickCard = () => {
        if (onClickItem) {
            onClickItem(inventoryAsset);
        } else {
            if (
                checkPermission(permissions, permissionCodeConstant.asset_view_detail)
            )
                navigate(`${staticPath.viewInventoryAsset + "/" + inventoryAsset.id}`);
        }
    };
    return (
        <Card
            key={inventoryAsset?.id}
            bodyStyle={{ padding: 10 }}
            style={{ margin: 5 }}
            onClick={onClickCard}
        // className={"my-inventory-asset-status-" + inventoryAsset.status}
        >
            <Row align="middle" >
                <Row >
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
                </Row>
            </Row>
        </Card>
    );
};

export default CardItemInventoryAsset;
