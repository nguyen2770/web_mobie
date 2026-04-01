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
export default function WorkDiaryCW() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const params = useParams();
    const [calibrationWorkTimelines, setCalibrationWorkTimelines] = useState([]);

    useEffect(() => {
        fetchGetCalibrationWorkById();
    }, [params.id]);
    const fetchGetCalibrationWorkById = async () => {
        let res = await _unitOfWork.calibrationWork.getCalibrationWorkById(params.id);
        if (res) {
            setCalibrationWorkTimelines(res?.calibrationWorkTimeline);
        }
    };
    const timelineLabelKey = (status) => {
        switch (status) {
            case progressStatus.new: return t("breakdown.view.timeline.created");
            case progressStatus.cloesed: return t("breakdown.view.timeline.closed");
            case progressStatus.cancelled: return t("breakdown.view.timeline.cancelled");
            case progressStatus.experimentalFix: return t("breakdown.view.timeline.experimental_fix");
            case progressStatus.fixedOnTrial: return t("breakdown.view.timeline.fixed_on_trial");
            case progressStatus.assigned: return t("breakdown.view.timeline.assigned");
            case progressStatus.reassignment: return t("calibrationWork.view.timeline.reassignment");
            case progressStatus.reopen: return t("breakdown.view.timeline.reopen");
            case progressStatus.requestForSupport: return t("breakdown.view.timeline.request_for_support");
            case progressStatus.replacement: return t("breakdown.view.timeline.replacement");
            case progressStatus.accepted: return t("breakdown.view.timeline.accepted");
            case progressStatus.WCA:
            case progressStatus.WWA: return t("breakdown.view.timeline.confirmed");
            case progressStatus.rejected: return t("calibrationWork.view.timeline.rejected");
            case progressStatus.completed: return t("calibrationWork.view.timeline.completed");
            case progressStatus.partiallyCompleted: return t("calibrationWork.view.timeline.partiallyCompleted");
            case progressStatus.completeRecalibrationIssue: return t("calibrationWork.view.timeline.completeRecalibrationIssue");
            default: return "";
        }
    };
    return (
        <div style={{ background: "#fff" }}>
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
                    <span style={{ flex: 1 }}>{t("breakdown.view.menu.work_diary")}</span>
                </div>
            </Col>
            <Col span={24} style={{ padding: 16 }}>
                {calibrationWorkTimelines.length > 0 ? (
                    <Timeline className="mt-2">
                        {calibrationWorkTimelines.map((item, index) => {
                            let label = timelineLabelKey(item?.status);
                            if (!label && (item?.loginDate || item?.logoutDate)) {
                                label = t("calibrationWork.view.timeline.work_date");
                            }
                            return (
                                <Timeline.Item
                                    key={index}
                                    dot={
                                        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 24 }} />
                                    }
                                    style={{ marginBottom: 16 }}
                                >
                                    <div style={{ padding: "7px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
                                        {label && (
                                            <div>
                                                <b>{label} :</b> {dayjs(item?.workedDate).format("DD/MM/YYYY HH:mm")}
                                            </div>
                                        )}
                                        <div><b>{t("breakdown.view.timeline.comment")} : </b> {item?.comment || "null"}</div>
                                        <div><b>{t("breakdown.view.timeline.status")} : </b> {
                                            t(progressStatus.Option.find(p => p.value === item.status)?.label)
                                        }</div>
                                        {item?.loginDate && (<div><b>{t("breakdown.view.timeline.login_time")} : </b> {dayjs(item?.loginDate).format("DD/MM/YYYY HH:mm")}</div>)}
                                        {item?.logoutDate && (<div><b>{t("breakdown.view.timeline.logout_time")} : </b> {dayjs(item?.logoutDate).format("DD/MM/YYYY HH:mm")}</div>)}
                                        {item.designatedUser && (
                                            <div>
                                                <b>{t("breakdown.view.timeline.designated_user")}:</b> {item.designatedUser?.fullName}
                                            </div>
                                        )}
                                        {item.indicatedUserBy && (
                                            <div>
                                                <b>{t("breakdown.view.timeline.executed_by")}:</b> {item.indicatedUserBy?.fullName}
                                            </div>
                                        )}
                                        {item.acceptedBy && (
                                            <div>
                                                <b>Chấp thuận bởi:</b> {item.acceptedBy?.fullName}
                                            </div>
                                        )}
                                        {item.workedBy && (
                                            <div>
                                                <b>{t("breakdown.view.timeline.executed_by")}:</b> {item.workedBy?.fullName}
                                            </div>
                                        )}
                                        {item.replacementUser && (
                                            <div>
                                                <b>{t("breakdown.view.timeline.replacement_user")}:</b> {item.replacementUser?.fullName}
                                            </div>
                                        )}
                                        {item.replacementReason && (
                                            <div>
                                                <b>Lý do thay thế:</b> {item.replacementReason}
                                            </div>
                                        )}
                                    </div>
                                </Timeline.Item>
                            );
                        })}
                    </Timeline>
                ) : (
                    <span style={{ fontWeight: 500, color: "inherit" }}>{t("Không có nhật ký")}</span>
                )}
            </Col>
        </div>
    );
}