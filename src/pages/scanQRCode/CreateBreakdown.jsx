import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import ShowError from "../../components/modal/result/errorNotification";
import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  PlusCircleFilled,
} from "@ant-design/icons";
import AttachmentComponent from "../myBreakdown/AttachmentComponent";
import {
  assetMaintenanceStatus,
  FORMAT_DATE,
  priorityLevelStatus,
  STORAGE_KEY,
} from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import useQuery from "../../helper/useQuery";
import useAuth from "../../contexts/authContext";
import { staticPathUnAuthen } from "../../router/RouteUnAuthenConfig";
import { useTranslation } from "react-i18next";

const { Search } = Input;
export default function CreateBreakdown() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let query = useQuery();
  const params = useParams();
  const [assetMaintenanceId, setAssetMaintenanceId] = useState(
    query.get("assetMaintenance"),
  );
  const [companyCode, setCompanyCode] = useState(query.get("companyCode"));
  const [fileList, setFileList] = useState([]);
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [showSubServiceCategory, setShowSubServiceCategory] = useState(false);
  const [serviceSubCategorys, setServiceSubCategorys] = useState([]);
  const [assetModelFailureTypes, setAssetModelFailureTypes] = useState([]);
  const [company, setCompany] = useState(null);
  const { user, permissions, token } = useAuth();

  useEffect(() => {
    if (assetMaintenanceId) {
      fetchAssetMaintenance();
    }
  }, [assetMaintenanceId]);

  useEffect(() => {
    if (assetMaintenceChange) {
      fetchGetAssetModelFailureTypeByAssetModel();
    }
  }, [assetMaintenceChange]);

  const fetchAssetMaintenance = async () => {
    let res = await _unitOfWork.assetMaintenance.getAssetMaintenance({
      id: assetMaintenanceId,
    });
    if (res && res.code === 1) {
      form.setFieldsValue({
        assetModel: res.data?.assetModel?.assetModelName,
        asset: res.data?.assetModel?.asset?.assetName,
        serial: res.data?.serial,
        assetNumber: res.data?.assetNumber,
        customer: res.data?.customer?.customerName,
      });
      setCompany(res.data?.createdBy?.company);
      setAssetMaintenceChange(res?.data);
    }
  };

  const fetchGetAssetModelFailureTypeByAssetModel = async () => {
    setAssetModelFailureTypes([]);
    let payload = {
      assetModel: assetMaintenceChange?.assetModel?.id,
    };
    let res =
      await _unitOfWork.assetModelFailureType.getAllAssetModelFailureType(
        payload,
      );
    if (res && res.code === 1) {
      setAssetModelFailureTypes(res.data);
    }
  };

  const onFinish = async () => {
    const values = await form.getFieldsValue();
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const resUpload = await _unitOfWork.resource.uploadDocumentBreakdown({
          file: file?.originFileObj,
          companyCode: company?.code,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload.resourceId,
          });
        }
      }
    }
    const formatedValues = {
      ...values,
      listResource: newSupportDocuments,
      assetMaintenance: assetMaintenceChange?.id,
    };
    let response;
    if (token) {
      response = await _unitOfWork.breakdown.createBreakdown(formatedValues);
    } else {
      response =
        await _unitOfWork.breakdown.createBreakdownNoAuth(formatedValues);
    }

    if (response && response.code === 1) {
      form.resetFields();
      navigate(staticPathUnAuthen.showResponseCreateBreakdown);
    } else {
      ShowError(
        "topRight",
        t("modal.notifications.error_default_title"),
        t("breakdown.create.messages.create_error"),
      );
    }
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
        <ArrowLeftOutlined
          style={{ fontSize: 20, marginRight: 16, cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        {t("breakdown.create.title")}
      </div>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
      >
        <Card>
          <Row gutter={[16, 8]}>
            <Col span={24}>
              <Form.Item
                label={t("scanQRCode.asset_number")}
                name="assetNumber"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: t("scanQRCode.required_asset_number"),
                  },
                ]}
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.serial")}
                name="serial"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.serial")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.asset")}
                name="asset"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.asset")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.asset_model")}
                name="assetModel"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.model")}
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.customer")}
                name="customer"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input
                  placeholder={t("breakdown.create.placeholders.customer")}
                  disabled
                ></Input>
              </Form.Item>
            </Col>
            {showSubServiceCategory && (
              <Col span={24}>
                <Form.Item
                  label={t("breakdown.create.fields.service_sub_category")}
                  name="subServiceCategory"
                  labelAlign="left"
                  style={{ marginBottom: 12 }}
                  labelCol={{ style: { paddingBottom: 4 } }}
                >
                  <Select
                    placeholder={t(
                      "breakdown.create.placeholders.service_sub_category",
                    )}
                    showSearch
                    allowClear
                    options={(serviceSubCategorys || []).map((item) => ({
                      value: item.id,
                      label: item.serviceSubCategoryName,
                    }))}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <Form.Item
                name="incidentDeadline"
                label={t("breakdown.create.fields.incident_deadline")}
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <DatePicker
                  placeholder={t(
                    "breakdown.create.placeholders.incident_deadline",
                  )}
                  format={FORMAT_DATE}
                  style={{ width: "100%" }}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.failure_type")}
                name="breakdownDefect"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Select
                  placeholder={t("breakdown.create.placeholders.failure_type")}
                  options={(assetModelFailureTypes || []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.asset_status")}
                name="assetMaintenanceStatus"
                labelAlign="left"
                initialValue={assetMaintenanceStatus.isNotActive}
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Select
                  placeholder={t("breakdown.create.placeholders.asset_status")}
                  options={(assetMaintenanceStatus.Options || []).map(
                    (item) => ({
                      value: item.value,
                      label: t(item.label),
                    }),
                  )}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.priority_level")}
                name="priorityLevel"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Select
                  placeholder={t(
                    "breakdown.create.placeholders.priority_level",
                  )}
                  options={(priorityLevelStatus.Options || []).map((item) => ({
                    value: item.value,
                    label: t(item.label),
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label={t("breakdown.create.fields.description")}
                name="defectDescription"
                labelAlign="left"
                style={{ marginBottom: 12 }}
                labelCol={{ style: { paddingBottom: 4 } }}
              >
                <Input.TextArea
                  placeholder={t("breakdown.create.placeholders.description")}
                />
              </Form.Item>
            </Col>
            {!user && (
              <Col span={24}>
                <Form.Item
                  label={t("breakdown.create.fields.reporter_name")}
                  name="userNameSubmitProblem"
                  labelAlign="left"
                  style={{ marginBottom: 12 }}
                  labelCol={{ style: { paddingBottom: 4 } }}
                >
                  <Input
                    placeholder={t(
                      "breakdown.create.placeholders.reporter_name",
                    )}
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={24}>
              <AttachmentComponent value={fileList} onChange={setFileList} />
            </Col>{" "}
          </Row>
          <Row
            style={{
              width: "100%",
              background: "#fff",
              textAlign: "center",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "30vw", width: "100%", fontWeight: 700 }}
            >
              <CloudUploadOutlined /> {t("common_buttons.create_breakdown")}
            </Button>
          </Row>
        </Card>
      </Form>
    </div>
  );
}
