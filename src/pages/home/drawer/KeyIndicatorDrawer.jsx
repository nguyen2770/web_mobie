import {
  ArrowLeftOutlined,
  FileUnknownOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Col, Row, Card, Radio, Popover, Drawer } from "antd";
import { Tiny } from "@ant-design/plots";
import React, { useEffect, useState } from "react";
import * as _unitOfWork from "../../../api";
import { Column, Line } from "@ant-design/plots";
import { useTranslation } from "react-i18next";

const KeyIndicatorDrawer = ({ open, onClose }) => {
  const [keyIndicatorsType, setKeyIndicatorsType] = useState("oneMonth");
  const [schedulePreventiveCompliance, setSchedulePreventiveCompliance] =
    useState(null);
  const [breakdownCompliance, setBreakdownCompliance] = useState(null);
  const [upTimeAssetMaintenance, setUpTimeAssetMaintenance] = useState(null);
  const [schedulePreventiveVsAssignUser, setSchedulePreventiveVsAssignUser] =
    useState([]);
  const [calibrationWorkCompliance, setCalibrationWorkCompliance] =
    useState(null);
  const { t } = useTranslation();

  const optionKeyIndecatorsType = [
    { label: t("keyIndicators.range_one_month"), value: "oneMonth" },
    { label: t("keyIndicators.range_three_month"), value: "threeMonth" },
    { label: t("keyIndicators.range_six_month"), value: "sixMonth" },
  ];

  const formulaContent = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("keyIndicators.formula_detail_title")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span style={{ flex: 1 }}>
          {t("keyIndicators.formula_completed_schedules")}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ flex: 1 }}>
          {t("keyIndicators.formula_created_schedules")}
        </span>
      </div>
    </div>
  );
  const formulaCalibrationWork = (
    <div style={{ minWidth: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {t("dashboard.key.formula.preventive_title")}
      </div>
      <div style={{ marginBottom: 4 }}>
        {t("dashboard.key.formula.calibration_work_num_done")}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <span
          style={{ flex: 1, borderBottom: "1px dashed #888", marginRight: 8 }}
        ></span>
        <span style={{ fontWeight: 600, fontSize: 16, marginRight: 8 }}>×</span>
        <span style={{ fontWeight: 600, fontSize: 16 }}>100</span>
      </div>
      <div>{t("dashboard.key.formula.calibration_work_den")}</div>
    </div>
  );
  useEffect(() => {
    fetchGetSchedulePreventiveCompliance();
    fetchGetBreakdownCompliance();
    fetchGetUpTimeAssetMaintenance();
    fetchGetSchedulePreventiveVsAssignUser();
    fetchGetCalibrationWorkCompliance();
  }, [keyIndicatorsType]);

  const fetchGetSchedulePreventiveCompliance = async () => {
    let res = await _unitOfWork.report.getSchedulePreventiveCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setSchedulePreventiveCompliance(res.percentSchedulePreventive);
    }
  };
  const fetchGetBreakdownCompliance = async () => {
    let res = await _unitOfWork.report.getBreakdownCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setBreakdownCompliance(res.percentBreakdown);
    }
  };
  const fetchGetUpTimeAssetMaintenance = async () => {
    let res = await _unitOfWork.report.getUpTimeAssetMaintenance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setUpTimeAssetMaintenance(res.data);
    }
  };
  const fetchGetCalibrationWorkCompliance = async () => {
    let res = await _unitOfWork.report.getCalibrationWorkCompliance({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      setCalibrationWorkCompliance(res.percentCalibrationWork);
    }
  };
  const fetchGetSchedulePreventiveVsAssignUser = async () => {
    let res = await _unitOfWork.report.getSchedulePreventiveVsAssignUser({
      type: keyIndicatorsType,
    });
    if (res && res.code === 1) {
      let data = [];
      data.push({
        pv: res?.data?.totalSchedulePreventive,
        action: t("keyIndicators.schedule_action_schedule"),
      });
      data.push({
        pv: res?.data?.totalSchedulePreventiveAssignUser,
        action: t("keyIndicators.schedule_action_assign"),
      });
      setSchedulePreventiveVsAssignUser(data);
    }
  };

  const configSchedulePreventiveVsAssign = {
    data: schedulePreventiveVsAssignUser,
    xField: "action",
    yField: "pv",
    style: {
      maxWidth: 35,
    },
    label: {
      text: (d) => d.pv,
      textBaseline: "bottom",
    },
    width: 300,
    height: 200,
  };

  const getRingConfig = (percent, value) => ({
    percent: percent / 100,
    width: 200,
    height: 200,
    color: ["#E8EFF5", "#66AFF4"],
    annotations: [
      {
        type: "text",
        style: {
          text: `${Number(value).toFixed(2)}%`,
          x: "50%",
          y: "50%",
          textAlign: "center",
          fontSize: 16,
          fontStyle: "bold",
        },
      },
    ],
  });

  const configSchedulePreventive = getRingConfig(schedulePreventiveCompliance, schedulePreventiveCompliance);
  const configCalibrationWork = getRingConfig(calibrationWorkCompliance, calibrationWorkCompliance);
  const configBreakdown = getRingConfig(breakdownCompliance, breakdownCompliance);
  const configUpTimeAssetMaintenance = getRingConfig(upTimeAssetMaintenance, upTimeAssetMaintenance);
  return (
    <Drawer
      placement="right"
      closable={false}
      open={open}
      width="100%"
      className="drawer-schedule-preventive-history"
      bodyStyle={{
        padding: 0,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 56,
          background: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8c 100%)",
          color: "#fff",
          padding: "0 16px",
          fontWeight: 600,
          fontSize: 20,
          boxSizing: "border-box",
          flexShrink: 0,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
        }}
      >
        <ArrowLeftOutlined
          style={{ fontSize: 22, marginRight: 16, cursor: "pointer", transition: "all 0.3s" }}
          onClick={onClose}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        <span style={{ flex: 1 }}>{t("keyIndicators.title")}</span>
      </div>
      <div className="p-3" style={{ flex: 1, overflowY: "auto" }}>
        <Row gutter={[16, 16]} className="mb-2">
          <Col span={24}>
            <div
              style={{
                background: "#fff",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
              }}
            >
              <Radio.Group
                block
                options={optionKeyIndecatorsType}
                value={keyIndicatorsType}
                optionType="button"
                buttonStyle="solid"
                onChange={(e) => setKeyIndicatorsType(e.target.value)}
                style={{
                  width: "100%",
                  display: "flex",
                  gap: "8px",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Row>
                <Col span={16} style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>
                  {t("keyIndicators.preventive")}
                </Col>
                <Col span={8} style={{ textAlign: "end" }}>
                  <Popover
                    placement="top"
                    title={null}
                    content={formulaContent}
                    trigger="click"
                  >
                    <FileUnknownOutlined
                      className="mr-2"
                      style={{ cursor: "pointer", fontSize: 16, color: "#4680ff" }}
                    />
                  </Popover>
                  <MenuOutlined style={{ fontWeight: "bold", fontSize: 16, color: "#4680ff" }} />
                </Col>
              </Row>
              <Row className="mt-3" justify="center">
                <Tiny.Ring
                  className="tiny-ring"
                  {...configSchedulePreventive}
                />
              </Row>
              <Row className="mt-3">
                <Col
                  span={24}
                  style={{
                    textAlign: "center",
                    color: "#4680ff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {t("keyIndicators.completion_rate")} -{" "}
                  {schedulePreventiveCompliance != null
                    ? `${Number(schedulePreventiveCompliance).toFixed(2)}`
                    : "0.00%"}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Row>
                <Col span={16} style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>
                  {t("keyIndicators.breakdown")}
                </Col>
                <Col span={8} style={{ textAlign: "end" }}>
                  <Popover
                    placement="top"
                    title={null}
                    content={formulaContent}
                    trigger="click"
                  >
                    <FileUnknownOutlined
                      className="mr-2"
                      style={{ cursor: "pointer", fontSize: 16, color: "#4680ff" }}
                    />
                  </Popover>
                  <MenuOutlined style={{ fontWeight: "bold", fontSize: 16, color: "#4680ff" }} />
                </Col>
              </Row>
              <Row className="mt-3" justify="center">
                <Tiny.Ring className="tiny-ring" {...configBreakdown} />
              </Row>
              <Row className="mt-3">
                <Col
                  span={24}
                  style={{
                    textAlign: "center",
                    color: "#4680ff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {t("keyIndicators.completion_rate")} -{" "}
                  {breakdownCompliance != null
                    ? `${Number(breakdownCompliance).toFixed(2)}`
                    : "0.00%"}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Row>
                <Col span={16} style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>
                  {t("baseLayout.nav.calibration_work")}
                </Col>
                <Col span={8} style={{ textAlign: "end" }}>
                  <Popover
                    placement="top"
                    title={null}
                    content={formulaCalibrationWork}
                    trigger="click"
                  >
                    <FileUnknownOutlined
                      className="mr-2"
                      style={{ cursor: "pointer", fontSize: 16, color: "#4680ff" }}
                    />
                  </Popover>
                  <MenuOutlined style={{ fontWeight: "bold", fontSize: 16, color: "#4680ff" }} />
                </Col>
              </Row>
              <Row className="mt-3" justify="center">
                <Tiny.Ring className="tiny-ring" {...configCalibrationWork} />
              </Row>
              <Row className="mt-3">
                <Col
                  span={24}
                  style={{
                    textAlign: "center",
                    color: "#4680ff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {t("dashboard.key.completion_rate")} -{" "}
                  {calibrationWorkCompliance != null
                    ? `${Number(calibrationWorkCompliance).toFixed(2)}`
                    : "0.00%"}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Row>
                <Col span={16} style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>
                  {t("keyIndicators.uptime")}
                </Col>
                <Col span={8} style={{ textAlign: "end" }}>
                  <MenuOutlined style={{ fontWeight: "bold", fontSize: 16, color: "#4680ff" }} />
                </Col>
              </Row>
              <Row className="mt-3" justify="center">
                <Tiny.Ring
                  className="tiny-ring"
                  {...configUpTimeAssetMaintenance}
                />
              </Row>
              <Row className="mt-3">
                <Col
                  span={24}
                  style={{
                    textAlign: "center",
                    color: "#4680ff",
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {t("keyIndicators.uptime_rate")} -{" "}
                  {upTimeAssetMaintenance != null
                    ? `${Number(upTimeAssetMaintenance).toFixed(2)}`
                    : "0.00%"}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              style={{
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                border: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.15)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Row>
                <Col span={18} style={{ fontWeight: 700, fontSize: 16, color: "#1e3a5f" }}>
                  {t("keyIndicators.schedule_vs_assign")}
                </Col>
                <Col span={6} style={{ textAlign: "end" }}>
                  <MenuOutlined style={{ fontWeight: "bold", fontSize: 16, color: "#4680ff" }} />
                </Col>
              </Row>
              <Row className="mt-3">
                <div className="mt-3 preventive-schedule-complete-chart wp-100">
                  <Column
                    className="wp-100"
                    {...configSchedulePreventiveVsAssign}
                  />
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </Drawer>
  );
};

export default React.memo(KeyIndicatorDrawer);
