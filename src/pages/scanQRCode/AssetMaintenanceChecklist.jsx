import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../api";
import ShowError from "../../components/modal/result/errorNotification";
import { ArrowLeftOutlined, PaperClipOutlined } from "@ant-design/icons";
import { priorityLevelStatus } from "../../utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import useQuery from "../../helper/useQuery";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import "./index.scss";
import AttachmentComponent from "../myBreakdown/AttachmentComponent";
export default function AssetMaintenanceChecklist() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  let query = useQuery();
  const params = useParams();
  const [assetMaintenanceId, setAssetMaintenanceId] = useState(
    query.get("assetMaintenance"),
  );
  const [assetMaintenceChange, setAssetMaintenceChange] = useState(null);
  const [assetMaintenanceChecklist, setAssetMaintenanceChecklist] = useState(
    [],
  );
  const checkboxBreakdown = Form.useWatch("checkboxBreakdown", form);
  const [company, setCompany] = useState(null);
  const { user, permissions, token } = useAuth();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (assetMaintenanceId) {
      fetchAssetMaintenance();
      fetchGetAssetMaintenanceChecklistByResNotAuth();
    }
  }, [assetMaintenanceId]);

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

  const fetchGetAssetMaintenanceChecklistByResNotAuth = async () => {
    let payload = {
      assetMaintenance: assetMaintenanceId,
    };
    let res =
      await _unitOfWork.assetMaintenance.getAssetMaintenanceChecklistByResNotAuth(
        payload,
      );
    if (res && res.code === 1) {
      const formattedData = res.data.map((item, index) => ({
        ...item,
        uid: item._id || index, // đảm bảo unique
        index: index + 1,
        status: item.status || false,
      }));

      setAssetMaintenanceChecklist(formattedData);
    }
  };
  const handleStatusChange = (checked, record) => {
    setAssetMaintenanceChecklist((prev) =>
      prev.map((item) =>
        item.uid === record.uid ? { ...item, status: checked } : item,
      ),
    );
  };
  const onChange = (e) => {
    form.setFieldsValue({
      checkboxBreakdown: e.target.checked,
    });
  };

  const onFinish = async () => {
    const newSupportDocuments = [];
    if (fileList) {
      for (let i = 0; i < fileList.length; i++) {
        const fileObj = fileList[i].originFileObj;
        const resUpload = await _unitOfWork.resource.uploadDocumentBreakdown({
          companyCode: company?.code,
          file: fileObj,
        });
        if (resUpload && resUpload.code === 1) {
          newSupportDocuments.push({
            resource: resUpload?.resourceId,
          });
        } else {
          message.error(t("common.messages.errors.upload_failed"));
          return;
        }
      }
    }
    const payload = {
      assetMaintenance: assetMaintenanceId,
      checklistItems: assetMaintenanceChecklist.map((item) => ({
        content: item.content,
        status: item.status,
        index: item.index,
      })),
      checkboxBreakdown: checkboxBreakdown || false,
      breakdownDescription: form.getFieldValue("breakdownDescription") || "",
      priorityLevel: form.getFieldValue("priorityLevel") || null,
      note: form.getFieldValue("note") || "",
      nameUser: form.getFieldValue("nameUser") || "",
      listDocuments: newSupportDocuments,
    };
    try {
      const res =
        await _unitOfWork.propertyInspection.createPropertyInspection(payload);
      if (res && res.code === 1) {
        navigate(-1);
        message.success("Tạo thành công");
      }
    } catch (error) {
      message.error("Tạo thất bại");
    }
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      align: "center",
      width: "5%",
    },
    {
      title: "Tên công việc",
      dataIndex: "content",
    },
    {
      title: "Hoàn thành công việc",
      dataIndex: "status",
      width: "25%",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={record.status || false}
          onChange={(e) => handleStatusChange(e.target.checked, record)}
        />
      ),
    },
  ];
  return (
    <div style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HEADER */}
      <div className="checklist-header">
        <ArrowLeftOutlined className="back-icon" onClick={() => navigate(-1)} />
        {t("Hoàn thành danh sách kiểm tra tài sản")}
      </div>

      {/* CONTENT */}
      <div className="checklist-container">
        <Table
          columns={columns}
          dataSource={assetMaintenanceChecklist}
          rowKey="uid"
          pagination={false}
          size="middle"
          className="checklist-table"
          onRow={(record) => ({
            onClick: () => {
              handleStatusChange(!record.status, record);
            },
          })}
        />
      </div>
      <Form form={form} onFinish={onFinish} className="checklist-form p-2">
        <Row gutter={16} className="checklist-form-row">
          <Col span={24}>
            <Form.Item label="Tên người kiểm tra" name="nameUser">
              <Input placeholder="Nhập tên người kiểm tra" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <AttachmentComponent value={fileList} onChange={setFileList} />
          </Col>{" "}
          <Col span={12}>
            <Form.Item name="checkboxBreakdown">
              <Checkbox onChange={onChange}>Gặp sự cố</Checkbox>
            </Form.Item>
          </Col>
          {checkboxBreakdown && checkboxBreakdown === true && (
            <>
              {" "}
              <Col span={24}>
                <Form.Item
                  label={t("breakdown.create.fields.priority_level")}
                  name="priorityLevel"
                  labelAlign="left"
                  style={{ marginBottom: 12 }}
                  labelCol={{ style: { paddingBottom: 4 } }}
                  rules={[
                    { required: true, message: "Vui lòng chọn mức độ ưu tiên" },
                  ]}
                >
                  <Select
                    placeholder={t(
                      "breakdown.create.placeholders.priority_level",
                    )}
                    options={(priorityLevelStatus.Options || []).map(
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
                  label="Mô tả sự cố"
                  name="breakdownDescription"
                  rules={[
                    { required: true, message: "Vui lòng nhập mô tả sự cố" },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="Mô tả sự cố..." />
                </Form.Item>
              </Col>
            </>
          )}
        </Row>
        <div className="checklist-footer">
          <Button
            type="primary"
            style={{ width: "100%", fontWeight: "bold" }}
            htmlType="submit"
          >
            {t("common_buttons.submit")}
          </Button>
        </div>
      </Form>
    </div>
  );
}
