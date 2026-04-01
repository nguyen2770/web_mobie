import React, { useEffect, useState } from "react";
import { Col, Timeline } from "antd";
import {
    ArrowLeftOutlined,
    CheckCircleTwoTone,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import * as _unitOfWork from "../../api";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { progressStatus } from "../../utils/constant";
import CardCalibrationHistory from "./CardCalibrationHistory";
export default function WorkDiaryCW() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const [calibrationWorkHistorys, setCalibrationWorkHistorys] = useState([]);

    useEffect(() => {
        fetchGetAllCalibrationWorkHistoryById();
    }, [params.id]);
    const fetchGetAllCalibrationWorkHistoryById = async () => {
        let res = await _unitOfWork.calibrationWork.getAllCalibrationWorkHistorys(params.id);
        if (res) {
            setCalibrationWorkHistorys(res?.calibrationWorkHistorys);
        }
    };

    return (
        <div style={{ background: "#f5f5f7" }}>
            <Col span={24}>
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
                        onClick={() => navigate(-1)}
                    />
                    <span style={{ flex: 1 }}>{t("calibrationWork.history_title")}</span>
                </div>
            </Col>
            <Col span={24} style={{ padding: 16 }}>
                {calibrationWorkHistorys.length > 0 ? calibrationWorkHistorys.map((item) => (
                    <CardCalibrationHistory calibrationHistory={item} />
                )) : (
                    <span style={{ fontWeight: 500, color: "inherit" }}>{t("Không có lịch sử hiệu chuẩn nào")}</span>
                )}
            </Col>
        </div>
    );
}