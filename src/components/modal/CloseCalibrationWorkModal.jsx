import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Card, Upload } from "antd";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../api";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PaperClipOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const CloseCalibrationWorkModal = ({
  open,
  onClose,
  calibrationWork,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  const handleFinish = async () => {
    try {
      const newSupportDocuments = [];
      if (fileList) {
        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i];
          const resUpload = await _unitOfWork.resource.uploadImage({
            file: file?.originFileObj,
          });
          if (resUpload && resUpload.code === 1) {
            newSupportDocuments.push({
              resource: resUpload.resourceId,
            });
          }
        }
      }
      const values = await form.validateFields();
      setLoading(true);
      const res = await _unitOfWork.calibrationWork.comfirmCloseCalibrationWork(
        {
          calibrationWork: calibrationWork?.id || calibrationWork?._id,
          note: values.note,
          listResource: newSupportDocuments,
        },
      );
      if (res && res.code === 1) {
        message.success(t("common.messages.success.close"));
        onRefresh();
        onClose();
        form.resetFields();
      } else {
        message.error(res?.message || t("common.messages.errors.close"));
      }
    } catch (error) {
      console.error("Error closing calibration work:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      confirmLoading={loading}
      className="custom-modal"
      closable={false}
      footer={null}
      onCancel={handleCancel}
    >
      <Card
        title={t("calibrationWork.close_title")}
        headStyle={{
          background: "#23457b",
          color: "#fff",
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="note" className="mb-2">
            <TextArea
              rows={3}
              placeholder={t("preventive.refuse.fields.reason_placeholder")}
            />
          </Form.Item>
          <Form.Item
            label={
              <span>
                <PaperClipOutlined />
                {t("preventiveSchedule.attachment_label", {
                  defaultValue: "Các tập tin đính kèm",
                })}
              </span>
            }
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              multiple
              listType="picture"
              maxCount={7}
            >
              <Button>
                {t("preventiveSchedule.attachment_choose_file", {
                  defaultValue: "Chọn file",
                })}
              </Button>
            </Upload>
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: "4px" }}>
            <Button
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              icon={<CloseCircleOutlined />}
            >
              {t("common_buttons.close")}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<CheckCircleOutlined />}
            >
              {t("common_buttons.submit")}
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default CloseCalibrationWorkModal;
