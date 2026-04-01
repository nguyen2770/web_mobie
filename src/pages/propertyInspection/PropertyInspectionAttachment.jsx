import React, { useState, useEffect, useRef } from "react";
import { Row, Col, message, Drawer, List, Typography, Button } from "antd";
import { ArrowLeftOutlined, DownloadOutlined, PaperClipOutlined, PlusCircleFilled } from "@ant-design/icons";
import * as _unitOfWork from "../../api";
import { useNavigate, useParams } from "react-router-dom";
import AttachmentModal from "../../components/modal/Attachment/AttachmentModal";
import { useTranslation } from "react-i18next";
const { Text } = Typography;

export default function PropertyInspectionAttachment({ open, onClose, listDocuments }) {
    const { t } = useTranslation()

    return (
        <Drawer
            placement="right"
            closable={false}
            open={open}
            width="100%"
            className="drawer-schedule-preventive-history"
            bodyStyle={{
                padding: 0,
                background: "#f8f8f8",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
            }}
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
                }}
            >
                <ArrowLeftOutlined
                    style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                    onClick={onClose}
                />
                <span style={{ flex: 1 }}>{t("breakdown.close.fields.attachments")}</span>
            </div>
            <AttachmentModal listDocuments={listDocuments} />
        </Drawer>
    );
};