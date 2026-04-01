import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Card } from "antd";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../api";

const { TextArea } = Input;

const ReopenCalibrationWorkModal = ({
  open,
  onClose,
  calibrationWork,
  onRefresh,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const res =
        await _unitOfWork.calibrationWork.comfirmReOpenCalibrationWork({
          calibrationWork: calibrationWork?.id || calibrationWork?._id,
          reasonForReopening: values.reasonForReopening,
        });
      if (res && res.code === 1) {
        message.success(t("common.messages.success.reopen"));
        onRefresh();
        onClose();
        form.resetFields();
      } else {
        message.error(
          res?.message || t("common.messages.errors.reopen_failed")
        );
      }
    } catch (error) {
      console.error("Error reopening calibration work:", error);
    }
  };

  const handleCancel = () => {
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      closable={false}
      footer={null}
      className="custom-modal"
    >
      <Card
        title={t("calibrationWork.reopen_title")}
        headStyle={{
          background: "#23457b",
          color: "#fff",
          fontWeight: 600,
          fontSize: 20,
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleOk}>
          <Form.Item
            name="reasonForReopening"
            rules={[
              {
                required: true,
                message: t("calibrationWork.enter_reason_for_reopening"),
              },
            ]}
          >
            <TextArea
              rows={4}
              placeholder={t("calibrationWork.reopening")}
              autoSize={{ minRows: 3, maxRows: 6 }}
            />
          </Form.Item>
          <div style={{ textAlign: "right", marginTop: "4px" }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              {t("common_buttons.close")}
            </Button>
            <Button type="primary" htmlType="submit">
              {t("common_buttons.submit")}
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default ReopenCalibrationWorkModal;
