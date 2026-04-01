import {
    CheckOutlined,
    CloseOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Divider, Image, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../../contexts/authContext";
import { checkPermission } from "../../../helper/permission-helper";
import { permissionCodeConstant } from "../../../utils/permissionCodeConstant";
import { useTranslation } from "react-i18next";
import { breakdownType, jobSummaryStatus, jobSummaryType } from "../../../utils/constant";
import { priventiveConfigStaticPath } from "../../../router/schedulePreventiveTaskAssignUserConfig";
import { staticPath } from "../../../router/RouteConfig";
import { calibrationPath } from "../../../router/calibrationConfig";
import { schedulePreventiveTaskAssignUserStatus } from "../../../utils/schedulePreventive.constant";
import { parseToLabel } from "../../../helper/parse-helper";
import * as _unitOfWork from "../../../api";
import { parseDatetime } from "../../../helper/date-helper";
import AssignUserRefuseSchedulePreventiveTask from "../../../pages/mySchedulePreventive/AssignUserRefuseSchedulePreventiveTask";
import { schedulePreventiveConfigStaticPath } from "../../../router/schedulePreventiveConfig";

const CardJobSummary = ({
    JobSummary,
    refresh,
}) => {
    const navigate = useNavigate();
    const { permissions } = useAuth();
    const { t } = useTranslation();

    const onClickView = (value) => {
        if (value.jobType === jobSummaryType.BREAKDOWN) {
            navigate(
                `${staticPath.viewMyBreakdown}/${(value.id || value._id)}?ticketStatus=${breakdownType.hasOpened}`
            );
        } else if (value.jobType === jobSummaryType.SCHEDULE_PREVENTIVE) {
            navigate(
                schedulePreventiveConfigStaticPath.schedulePreventiveDetail + "/" + (value.id || value._id)
            );
        } else {
            navigate(calibrationPath.calibrationWorkDetail + "/" + (value.id || value._id));
        }
    };

    return (
        <Card
            className="ticket-card"
            bodyStyle={{ padding: 10 }}
            style={{ margin: 5 }}
            onClick={() => onClickView(JobSummary)}
        >
            <Row align="middle">
                <Col span={24} style={{ textAlign: "end" }}>
                    <span className="ticket-status" style={{ color: "#1677ff" }}>
                        {t(parseToLabel(
                            jobSummaryStatus.Options,
                            JobSummary?.status
                        ))}
                    </span>
                </Col>
            </Row>

            <Row>
                <Row align="middle">
                    <Col span={4}>
                        <Image
                            width={60}
                            height={60}
                            src={_unitOfWork.resource.getImage(
                                JobSummary?.assetMaintenance?.resource
                            )}
                            preview={false}
                            style={{ borderRadius: "5px", background: "#eee" }}
                        />
                    </Col>
                    <Col span={20} style={{ paddingLeft: 10 }}>
                        <Row gutter={32}>
                            <Col span={24}>
                                <span className="ellipsis">
                                    {t("dashboard.key.chart.job")}{": "}
                                    {
                                        t(parseToLabel(jobSummaryType.Options, JobSummary?.jobType))
                                    }
                                </span>
                            </Col>
                            <Col span={24}>
                                <span className="ellipsis">
                                    {t("schedulePreventive.card.schedule_id_label")}{" "}
                                    {JobSummary?.code}
                                </span>
                            </Col>
                            <Col span={24}>
                                <span>
                                    {
                                        JobSummary?.assetMaintenance?.assetModel?.asset?.assetName || JobSummary?.assetMaintenance?.assetName
                                    }{" "}
                                    |{" "}
                                    {
                                        JobSummary?.assetMaintenance?.assetModel?.assetModelName
                                    }{" "}
                                    |{" "}
                                    {JobSummary?.assetMaintenance?.serial ||
                                        JobSummary?.assetMaintenance?.assetNumber}
                                </span>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Divider style={{ margin: "8px 0" }} />

                <Row className="wp-100">
                    <Col span={24}>
                        <div>
                            {t("schedulePreventive.card.user_label")}{" "}
                            {
                                JobSummary?.assetMaintenance?.customer?.customerName
                            }{" "}
                        </div>
                    </Col>
                    <Col span={24}>
                        <div>
                            {t("schedulePreventive.card.open_date_label")}{" "}
                            {parseDatetime(JobSummary?.createdAt || JobSummary?.startDate)}
                        </div>
                        {JobSummary.updatedAt ? (
                            <div style={{ color: "red" }}>
                                {t("schedulePreventive.card.updated_date_label")}{" "}
                                {parseDatetime(JobSummary?.updatedAt)}
                            </div>
                        ) : (
                            <></>
                        )}
                    </Col>
                </Row>
            </Row>
        </Card>
    );
};

export default CardJobSummary;