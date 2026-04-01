import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Image,
  Divider,
  Collapse,
  List,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import useQuery from "../../helper/useQuery";
import { staticPathUnAuthen } from "../../router/RouteUnAuthenConfig";
import { useTranslation } from "react-i18next";
import useAuth from "../../contexts/authContext";
import { assetStatusOptions, STORAGE_KEY } from "../../utils/constant";
import { parseDate } from "../../helper/date-helper";
import { staticPath } from "../../router/RouteConfig";
import ShowError from "../../components/modal/result/errorNotification";
import ViewInfoAssetMaintenanceDrawer from "../../components/Drawer/ViewInfoAssetMaintenanceDrawer";
import { parseToLabel } from "../../helper/parse-helper";
import { RightOutlined } from "@ant-design/icons";
export default function ScanQRCodeHome() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { user, logout } = useAuth();
  const [assetMaintenance, setAssetMaintenance] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  let query = useQuery();
  // const [assetMaintenanceId, setAssetMaintenanceId] = useState(
  //   query.get("assetMaintenance"),
  // );
  // const [companyCode, setCompanyCode] = useState(query.get("companyCode"));
  const assetMaintenanceId = query.get("assetMaintenance");
  const companyCode = query.get("companyCode");
  const [companyInfo, setCompanyInfo] = useState(null);
  const [propertyAccessories, setPropertyAccessories] = useState([]);
  const [propertyAccessory, setPropertyAccessory] = useState(null);
  useEffect(() => {
    if (!user || user?.company?.code === companyCode) {
      fetchGetCompanyByCodeNotAuth();
    } else {
      navigate(staticPath.notFound404);
    }
    fetchGetPropertyAccessoriesByAssetMaintenance();
  }, []);
  useEffect(() => {
    if (companyInfo) {
      fetchAssetMaintenance();
    }
  }, [companyInfo]);
  const fetchGetCompanyByCodeNotAuth = async () => {
    let res = await _unitOfWork.company.getCompanyByCode({ code: companyCode });
    if (res && res.code === 1) {
      if (res.company) {
        setCompanyInfo(res.company);
        localStorage.clear(STORAGE_KEY.COMPANY);
        localStorage.setItem(STORAGE_KEY.COMPANY, JSON.stringify(res.company));
      }
    }
  };
  const fetchGetPropertyAccessoriesByAssetMaintenance = async () => {
    let res =
      await _unitOfWork.assetMaintenance.getPropertyAccessoriesByAssetMaintenance(
        { id: assetMaintenanceId },
      );
    if (res && res.code === 1) {
      setPropertyAccessories(res?.data);
    }
  };
  const fetchAssetMaintenance = async () => {
    const res = await _unitOfWork.assetMaintenance.getAssetMaintenance({
      id: assetMaintenanceId,
    });

    if (res && res.code === 1) {
      setAssetMaintenance(res?.data);
    }
  };

  const onClickCreateBreakdown = async () => {
    const redirectUrl = `${staticPathUnAuthen.createBreakdown}?assetMaintenance=${assetMaintenanceId}&companyCode=${companyCode}`;
    if (companyInfo && companyInfo.loginBeforeStartingWork === true && !user) {
      // Lưu lại URL muốn quay lại
      localStorage.setItem(STORAGE_KEY.REDIRECTAFTERLOGIN, redirectUrl);

      ShowError(
        "topRight",
        "Thông báo",
        "Vui lòng đăng nhập trước khi thực hiện công việc",
      );
      return logout();
    }
    navigate(redirectUrl);
  };
  const onClickCreateCheckListAssetMaintenance = () => {
    const redirectUrl = `${staticPathUnAuthen.assetMaintenanceChecklist}?assetMaintenance=${assetMaintenanceId}&companyCode=${companyCode}`;
    if (companyInfo && companyInfo.loginBeforeStartingWork === true && !user) {
      // Lưu lại URL muốn quay lại
      localStorage.setItem(STORAGE_KEY.REDIRECTAFTERLOGIN, redirectUrl);
      ShowError(
        "topRight",
        "Thông báo",
        "Vui lòng đăng nhập trước khi thực hiện công việc",
      );
      return logout();
    }
    navigate(redirectUrl);
  };
  const onClickViewInfoPropertyAccessory = (value) => {
    setOpen(true);
    setPropertyAccessory(value);
  };
  return (
    <div>
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
        {t("scanQRCode.title_list_of_functions")}
      </div>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        <Card>
          <Row gutter={[16, 16]} justify="center">
            <Col span={24}>
              <Button
                type="primary"
                block
                size="large"
                onClick={onClickCreateBreakdown}
              >
                {t("scanQRCode.bt_report_a_problem")}
              </Button>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                block
                size="large"
                onClick={onClickCreateCheckListAssetMaintenance}
              >
                {t("Báo cáo danh sách kiểm tra bảo trì tài sản")}
              </Button>
            </Col>
            {/* 
          <Col span={24}>
            <Button
              type="default"
              block
              size="large"
              onClick={() =>
                navigate(
                  `${staticPathUnAuthen.detailAssetMaintenanceByScanQRCode}?assetMaintenance=${assetMaintenanceId}&companyCode=${companyCode}`,
                )
              }
            >
              {t("scanQRCode.bt_view_property_details")}
            </Button>
          </Col> */}
          </Row>
          {!assetMaintenance ? (
            <p>{t("scanQRCode.loading_data")}</p>
          ) : (
            <div>
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
                {assetMaintenance?.assetStatus && (
                  <Col span={24} style={{ marginTop: 16 }}>
                    <strong>{t("Trạng thái tài sản")}:</strong>
                    <Input
                      value={t(
                        parseToLabel(
                          assetStatusOptions.Options,
                          assetMaintenance.assetStatus,
                        ),
                      )}
                      disabled
                      style={{ marginTop: 4 }}
                    />
                  </Col>
                )}
                {assetMaintenance.assetModel?.category && (
                  <Col span={24} style={{ marginTop: 16 }}>
                    <strong>{t("scanQRCode.category")}:</strong>
                    <Input
                      value={
                        assetMaintenance.assetModel?.category?.categoryName
                      }
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
                        assetMaintenance.assetModel?.subCategory
                          ?.subCategoryName
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
                      value={
                        assetMaintenance.assetModel?.supplier?.supplierName
                      }
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
                {assetMaintenance?.registrationNumber && (
                  <Col span={24} style={{ marginTop: 16 }}>
                    <strong>{t("Số lưu hành")}:</strong>
                    <Input
                      value={
                        assetMaintenance.registrationNumber ||
                        t("Không có mô tả")
                      }
                      disabled
                      style={{ marginTop: 4 }}
                    />
                  </Col>
                )}
                {assetMaintenance.description && (
                  <Col span={24} style={{ marginTop: 16 }}>
                    <strong>{t("scanQRCode.description")}:</strong>
                    <Input.TextArea
                      value={
                        assetMaintenance.description || t("Không có mô tả")
                      }
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
                      <strong>
                        {t("assetMaintenance.form.fields.branch")}:
                      </strong>

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
                      <strong>
                        {t("assetMaintenance.form.fields.floor")}:
                      </strong>

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
                            : "" +
                              (assetMaintenance?.commune?.pathWithType || "")
                        }
                        disabled
                        style={{ marginTop: 4 }}
                      />
                    </Col>
                  </>
                }
              </Row>
              <Collapse bodyStyle={{ padding: 12 }}>
                <Collapse.Panel
                  header={
                    <b style={{ fontSize: "15px" }}>
                      {t("Thông tin thiết bị phụ")}
                    </b>
                  }
                  key="1"
                >
                  <List
                    dataSource={propertyAccessories}
                    renderItem={(item, index) => (
                      <Card
                        className="spare-card"
                        bodyStyle={{ padding: 5 }}
                        key={index}
                        style={{ marginBottom: 12 }}
                      >
                        <Row
                          align="middle"
                          gutter={[8, 8]}
                          onClick={() => onClickViewInfoPropertyAccessory(item)}
                        >
                          <Col span={4}>
                            <div className="spare-index pl-2">
                              <b style={{ textDecoration: "underline" }}>
                                {index + 1}
                              </b>
                            </div>
                          </Col>
                          <Col span={18} className="spare-content">
                            <div className="spare-code">
                              {t("Mã tài sản")} : <b>{item?.assetNumber}</b>
                            </div>
                            <div className="spare-name">
                              {t("Số sê - ri")} : <b>{item?.serial}</b>
                            </div>
                          </Col>
                          <Col span={2}>
                            <RightOutlined style={{ color: "#999" }} />
                          </Col>
                        </Row>
                      </Card>
                    )}
                    locale={{ emptyText: t("common.no_data") }}
                  />
                </Collapse.Panel>
              </Collapse>
            </div>
          )}
          <ViewInfoAssetMaintenanceDrawer
            open={open}
            onCancel={() => setOpen(false)}
            assetMaintenance={propertyAccessory}
          />
        </Card>
      </Form>
    </div>
  );
}
