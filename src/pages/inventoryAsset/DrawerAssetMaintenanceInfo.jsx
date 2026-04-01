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

const DrawerAssetMaintenanceInfo = ({
    open,
    onClose,
    assetMaintenanceId,
    onSaveAssetMaintenance
}) => {
    const [assetMaintenance, setAssetMaintenance] = useState(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (assetMaintenanceId) {
            fetchAssetMaintenance();
        } else {
            setAssetMaintenance(null);
        }
    }, [assetMaintenanceId]);
    const fetchAssetMaintenance = async () => {
        const res = await _unitOfWork.assetMaintenance.getAssetMaintenance({
            id: assetMaintenanceId,
        });

        if (res && res.code === 1) {
            setAssetMaintenance(res?.data);
        }
    };
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
                <span style={{ flex: 1 }}>{"Thông tin thiết bị/tài sản"}</span>
                <CheckOutlined
                    style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                    onClick={() => onSaveAssetMaintenance(assetMaintenance)}
                />
            </div>
            <Card>
                {!assetMaintenance ? (
                    <p>{t("scanQRCode.loading_data")}</p>
                ) : (
                    <Row gutter={24} style={{ marginBottom: 60 }} className="mt-3">
                        {assetMaintenance.resource && (
                            <Col span={24}>
                                <Image
                                    width={"100%"}
                                    // height={60}
                                    src={_unitOfWork.resource.getImage(
                                        assetMaintenance?.resource?.id,
                                    )}
                                    preview={false}
                                    className="mb-3"
                                    style={{ objectFit: "cover", background: "#eee" }}
                                />
                            </Col>
                        )}
                        {assetMaintenance?.serial && (
                            <Col span={24}>
                                <strong>{t("scanQRCode.serial")}:</strong>
                                <Input
                                    value={assetMaintenance?.serial}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance?.assetNumber && (
                            <Col span={24}>
                                <strong>{t("scanQRCode.asset_number")}:</strong>
                                <Input
                                    value={assetMaintenance?.assetNumber}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel?.asset?.assetName && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.asset_name")}:</strong>
                                <Input
                                    value={assetMaintenance.assetModel?.asset?.assetName}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel?.category && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.category")}:</strong>
                                <Input
                                    value={assetMaintenance.assetModel?.category?.categoryName}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel?.subCategory && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.sub_category")}:</strong>
                                <Input
                                    value={
                                        assetMaintenance.assetModel?.subCategory?.subCategoryName
                                    }
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel?.supplier && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.supplier")}:</strong>
                                <Input
                                    value={assetMaintenance.assetModel?.supplier?.supplierName}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel?.manufacturer && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.manufacturer")}:</strong>
                                <Input
                                    value={
                                        assetMaintenance.assetModel?.manufacturer
                                            ?.manufacturerName
                                    }
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetModel && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.asset_model_name")}:</strong>
                                <Input
                                    value={assetMaintenance.assetModel?.assetModelName}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.assetTypeCategory && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.asset_type_category")}:</strong>
                                <Input
                                    value={assetMaintenance.assetTypeCategory}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.customer && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.customer")}:</strong>
                                <Input
                                    value={assetMaintenance.customer?.customerName}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance?.installationDate && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.installation_date")}:</strong>
                                <Input
                                    value={parseDate(assetMaintenance?.installationDate)}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance?.purchaseDate && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.purchase_date")}:</strong>
                                <Input
                                    value={parseDate(assetMaintenance?.purchaseDate)}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.yearOfManufacturing && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.year_of_manufacturing")}:</strong>
                                <Input
                                    value={assetMaintenance.yearOfManufacturing}
                                    disabled
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {assetMaintenance.description && (
                            <Col span={24} style={{ marginTop: 16 }}>
                                <strong>{t("scanQRCode.description")}:</strong>
                                <Input.TextArea
                                    value={assetMaintenance.description || t("Không có mô tả")}
                                    disabled
                                    rows={3}
                                    style={{ marginTop: 4 }}
                                />
                            </Col>
                        )}
                        {
                            <>
                                <Divider>Vị trí</Divider>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <strong>{t("assetMaintenance.form.fields.branch")}:</strong>

                                    <Input
                                        value={assetMaintenance.branch?.name}
                                        disabled
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <strong>
                                        {t("assetMaintenance.form.fields.building")}:
                                    </strong>

                                    <Input
                                        value={assetMaintenance.building?.buildingName}
                                        disabled
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <strong>{t("assetMaintenance.form.fields.floor")}:</strong>

                                    <Input
                                        value={assetMaintenance.floor?.floorName}
                                        disabled
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <strong>
                                        {t("assetMaintenance.form.fields.department")}:
                                    </strong>

                                    <Input
                                        value={assetMaintenance.department?.departmentName}
                                        disabled
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <strong>
                                        {t("assetMaintenance.form.fields.address")}:
                                    </strong>

                                    <Input.TextArea
                                        value={
                                            assetMaintenance?.addressNote
                                                ? assetMaintenance?.addressNote +
                                                ", " +
                                                (assetMaintenance?.commune?.pathWithType || "")
                                                : "" + (assetMaintenance?.commune?.pathWithType || "")
                                        }
                                        disabled
                                        style={{ marginTop: 4 }}
                                    />
                                </Col>
                            </>
                        }
                    </Row>
                )}
            </Card>
        </Drawer>
    );
};
export default React.memo(DrawerAssetMaintenanceInfo);