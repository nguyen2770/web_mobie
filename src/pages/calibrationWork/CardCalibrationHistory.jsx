import { Card, Col, Divider, Image, Row, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import { parseDate, parseDatetime } from "../../helper/date-helper";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../router/RouteConfig";

const CardCalibrationHistory = ({ calibrationHistory }) => {
    const navigate = useNavigate();
    const { permissions } = useAuth();
    const { t } = useTranslation();
    const onClickHistoryDetail = () => {
        // if (
        //   checkPermission(
        //     permissions,
        //     permissionCodeConstant.schedule_preventive_view_detail
        //   )
        // )
        // navigate(
        //   `${staticPath.calibrationWorkDetail + "/" + calibrationHistory._id}`
        // );
    };
    return (
        <Card
            className="ticket-card"
            bodyStyle={{ padding: 0 }}
            style={{ margin: 0, padding: 0, marginBottom: 12 }}
            onClick={onClickHistoryDetail}
        >
            <div
                style={{
                    background: "#fff",
                    padding: "10px 0",
                    boxShadow: "0 1px 6px #0001",
                }}
            >
                <RowDetail
                    label={t("calibrationWork.performer")}
                    value={calibrationHistory?.calibrationWorkAssignUser?.user?.fullName || "—"}
                />
                <RowDetail
                    label={t("calibrationWork.detail.fields.calibration_date")}
                    value={parseDate(calibrationHistory?.calibrationWorkAssignUser?.confirmDate) || "—"}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 16px",
                        borderBottom: "1px solid #eee",
                        fontSize: 16,
                    }}
                >
                    <span style={{ color: "#888" }}>{t("calibrationWork.detail.fields.result")}</span>
                    {calibrationHistory.isPassed ? (
                        <Tag style={{ margin: 0 }} color="green">{t("calibrationWork.detail.fields.pass")}</Tag>
                    ) : (
                        <Tag style={{ margin: 0 }} color="red">{t("calibrationWork.detail.fields.fail")}</Tag>
                    )}
                </div>
                <RowDetail
                    label={t("calibrationWork.detail.fields.note")}
                    value={calibrationHistory?.comment || "—"}
                />
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "10px 16px",
                        borderBottom: "1px solid #eee",
                        fontSize: 16,
                    }}
                >
                    <span style={{ color: "#888" }}>{t("calibrationWork.detail.fields.breakdown")}</span>
                    {calibrationHistory.breakdown ? (
                        // <a
                        //     style={{ color: "#1677ff", cursor: "pointer" }}
                        //     onClick={() =>
                        //         navigate(
                        //             staticPath.viewMyBreakdown + "/" + calibrationHistory?.breakdown?.id
                        //         )
                        //     }
                        // >
                        <>{calibrationHistory?.breakdown?.code}</>
                        // </a>
                    ) : (
                        <span style={{ fontWeight: 500, color: "inherit" }}>—</span>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default CardCalibrationHistory;

function RowDetail({ label, value, color }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: "1px solid #eee",
                fontSize: 16,
            }}
        >
            <span style={{ color: "#888" }}>{label}</span>
            <span style={{ fontWeight: 500, color: color || "inherit" }}>{value}</span>
        </div>
    );
}
