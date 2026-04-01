import Modal from "antd/es/modal/Modal";
import React, { useEffect, useState } from "react";
import {
    ArrowLeftOutlined,
    CheckOutlined,
    CloseCircleOutlined,
    SearchOutlined,
    SyncOutlined,
} from "@ant-design/icons";
import {
    Drawer,
    Button,
    Col,
    Image,
    Input,
    Pagination,
    Row,
    Divider,
    Table,
    Card,
} from "antd";
import { assetType, PAGINATION } from "../../utils/constant";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next"; // Thêm import
import { parseDate } from "../../helper/date-helper";
import CardDetailAssetMaintenance from "./CardDetailAssetMaintenance";

const DrawerDetailAssetMaintenances = ({
    open,
    onClose,
    inventoryAssetDepartmentAssetMaintenances = [],
    group,
    onReload
}) => {
    const { t } = useTranslation();
    const generateShowAssetMaintenances = () => {
        if (!group) return [];
        var assetMaintenances = inventoryAssetDepartmentAssetMaintenances.filter(iadam => iadam?.asset?.id === group?.asset?.id && iadam?.assetModel?.id === group?.assetModel?.id)
        return assetMaintenances;
    }
    return (
        <Drawer
            placement="right"

            closable={false}
            visible={open}
            width="100%"
            className='drawer-task-history-assign-user'
            bodyStyle={{ padding: 0, background: "#f8f8f8", display: "flex", flexDirection: "column", height: "100vh" }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 56,
                    background: '#23457b',
                    color: '#fff',
                    padding: '0 16px',
                    fontWeight: 600,
                    fontSize: 20,
                    boxSizing: 'border-box',
                    flexShrink: 0
                }}
            >
                <ArrowLeftOutlined
                    style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                    onClick={onClose}
                />
                <span style={{ flex: 1 }}>{"Chi tiết thiết bị/tài sản"}</span>
            </div>
            {
                generateShowAssetMaintenances().map(item => {
                    return <CardDetailAssetMaintenance onReload={onReload} key={item.id} data={item} />
                })
            }
        </Drawer>
    );
};
export default React.memo(DrawerDetailAssetMaintenances);