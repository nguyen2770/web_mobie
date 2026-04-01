import { parseDatetime } from "../../helper/date-helper";
import { parseToLabel } from "../../helper/parse-helper";
import { propertyInspectionStatus } from "../../utils/constant";
import { useTranslation } from "react-i18next";

const CardPropertyInspectionAssetDetail = ({
    propertyInspection,
}) => {
    const { t } = useTranslation();
    return (
        <>
            {" "}
            <div
                style={{ fontWeight: 600, fontSize: 18, margin: "24px 0 12px 20px" }}
            >
                {t("propertyInspection.title_menu")}
            </div>
            <div
                style={{
                    background: "#fff",
                    margin: "0 12px 18px 12px",
                    padding: "10px 0",
                    boxShadow: "0 1px 6px #0001",
                    borderRadius: "8px"
                }}
            >
                <RowDetail
                    label={t("propertyInspection.code")}
                    value={propertyInspection?.code}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.status")}
                    value={t(
                        parseToLabel(propertyInspectionStatus.Options, propertyInspection?.status)
                    )}
                    color={
                        propertyInspectionStatus.Options.find(
                            (option) => option.value === propertyInspection?.status
                        )?.color
                    }
                />
                <RowDetail
                    label={t("propertyInspection.name_user")}
                    value={propertyInspection?.nameUser}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.updated_at")}
                    value={parseDatetime(propertyInspection?.updatedAt)}
                />
                <RowDetail
                    label={t("propertyInspection.note")}
                    value={propertyInspection?.note}
                    isLast={true}
                />
            </div>
            <div
                style={{ fontWeight: 600, fontSize: 18, margin: "24px 0 12px 20px" }}
            >
                {t("schedulePreventive.detail.asset_section_title")}
            </div>
            <div
                style={{
                    background: "#fff",
                    margin: "0 12px 18px 12px",
                    padding: "10px 0",
                    boxShadow: "0 1px 6px #0001",
                    borderRadius: "8px"
                }}
            >
                <RowDetail
                    label={t("schedulePreventive.detail.asset_name")}
                    value={propertyInspection?.assetMaintenance?.assetName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.model")}
                    value={propertyInspection?.assetMaintenance?.assetModelName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.serial")}
                    value={propertyInspection?.assetMaintenance?.serial}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.asset_number")}
                    value={propertyInspection?.assetMaintenance?.assetNumber}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.supplier")}
                    value={propertyInspection?.assetMaintenance?.supplierName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.manufacturer")}
                    value={propertyInspection?.assetMaintenance?.manufacturerName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.category")}
                    value={propertyInspection?.assetMaintenance?.categoryName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.customer")}
                    value={propertyInspection?.assetMaintenance?.customer?.customerName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.contact_number")}
                    value={propertyInspection?.assetMaintenance?.customer?.contactNumber}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.branch")}
                    value={propertyInspection?.assetMaintenance?.location?.branch?.branchName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.location")}
                    value={propertyInspection?.assetMaintenance?.addressNote}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.building")}
                    value={propertyInspection?.assetMaintenance?.location?.building?.buildingName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.floor")}
                    value={propertyInspection?.assetMaintenance?.location?.floor?.floorName}
                />
                <RowDetail
                    label={t("schedulePreventive.detail.department")}
                    value={propertyInspection?.assetMaintenance?.location?.branch?.departmentName}
                    isLast={true}
                />
            </div>
        </>
    );
};

export default CardPropertyInspectionAssetDetail;

function RowDetail({ label, value, color, isLast }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 8px",
                borderBottom: isLast ? "none" : "1px solid #eee",
                fontSize: 16,
            }}
        >
            <span style={{ color: "#888" }}>{label}</span>
            <span style={{ fontWeight: 500, color: color || "inherit" }}>{value}</span>
        </div>
    );
}
