import React, { useState } from "react";
import FileViewer from "react-file-viewer";
import {
    FilePdfOutlined,
    FileImageOutlined,
    FileWordOutlined,
    FileExcelOutlined,
    FilePptOutlined,
    FileZipOutlined,
    FileTextOutlined,
    PlayCircleOutlined,
    AudioOutlined,
    FileOutlined,
    DownloadOutlined
} from "@ant-design/icons";
import { Image, Modal, Button, Tooltip, List, Col, Typography } from "antd";
import { useTranslation } from "react-i18next";
import * as _unitOfWork from "../../../api";
const { Text } = Typography;

export default function AttachmentModal({ listDocuments }) {
    const { t } = useTranslation();

    const handleDownload = async (file) => {
        const response = await fetch(file.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name || "download";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };
    const renderFileIcon = (mimeType) => {
        if (!mimeType) return <FileOutlined className="mr-2" />;
        const type = mimeType.toLowerCase();

        if (type.includes("pdf")) {
            return <FilePdfOutlined className="mr-2" style={{ color: "#ff4d4f", fontSize: '20px' }} />;
        }
        if (type.includes("image")) {
            return <FileImageOutlined className="mr-2" style={{ color: "#52c41a", fontSize: '20px' }} />;
        }
        if (type.includes("word") || type.includes("officedocument.wordprocessingml")) {
            return <FileWordOutlined className="mr-2" style={{ color: "#1890ff", fontSize: '20px' }} />;
        }
        if (type.includes("excel") || type.includes("officedocument.spreadsheetml")) {
            return <FileExcelOutlined className="mr-2" style={{ color: "#237804", fontSize: '20px' }} />;
        }
        if (type.includes("presentation") || type.includes("officedocument.presentationml") || type.includes("powerpoint")) {
            return <FilePptOutlined className="mr-2" style={{ color: "#fa541c", fontSize: '20px' }} />;
        }
        if (type.includes("zip") || type.includes("rar") || type.includes("compressed")) {
            return <FileZipOutlined className="mr-2" style={{ color: "#722ed1", fontSize: '20px' }} />;
        }
        if (type.includes("video")) {
            return <PlayCircleOutlined className="mr-2" style={{ color: "#faad14", fontSize: '20px' }} />;
        }
        if (type.includes("audio")) {
            return <AudioOutlined className="mr-2" style={{ color: "#eb2f96", fontSize: '20px' }} />;
        }
        if (type.includes("text/plain")) {
            return <FileTextOutlined className="mr-2" style={{ color: "#595959", fontSize: '20px' }} />;
        }
        return <FileOutlined className="mr-2" style={{ color: "#8c8c8c", fontSize: '20px' }} />;
    };
    return (
        <List
            style={{ margin: 12, backgroundColor: "#fff", borderRadius: 0 }}
            bordered
            dataSource={listDocuments}
            renderItem={(doc) => (
                <List.Item
                    key={doc.resource?.id}
                    style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}
                >
                    <Col span={20}>
                        <Text style={{ fontSize: 15, color: '#333', lineHeight: '1.4', alignSelf: 'flex-start' }}>
                            {/* <PaperClipOutlined className="mr-1" /> */}
                            {renderFileIcon(doc.resource?.fileType)}
                            {`${doc?.resource?.fileName}${doc?.resource?.extension}`}
                        </Text>

                    </Col>
                    <Col span={4} style={{ textAlign: 'center' }}>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => handleDownload({
                                src: _unitOfWork.resource.getImage(doc?.resource?.id),
                                name: `${doc?.resource?.fileName}${doc?.resource?.extension}`
                            })}
                        />
                    </Col>
                </List.Item>
            )}
        />
    );
}