import { useEffect, useState, useRef } from "react";
import { Card, Col, Form, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, FilterOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../../api";
import { staticPath } from "../../../router/RouteConfig";
import { PAGINATION } from "../../../utils/constant";
import { parseDate } from "../../../helper/date-helper";
import "./index.scss";
import { t } from "i18next";
import { cleanEmptyValues } from "../../../helper/check-search-value";
import CardFilterContract from "./CardFilterContract";

export default function CalibrationContract() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [page, setPage] = useState(1);
    const [searchForm] = Form.useForm();
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        if (page > 1) {
            fetchContracts(page, valueFilter);
        } else {
            fetchContracts(1, valueFilter);
        }
    }, [page]);

    const fetchContracts = async (_page, value) => {
        const payload = {
            page: _page || page,
            limit: PAGINATION.limit,
            ...cleanEmptyValues(value || {}),
        };
        const res = await _unitOfWork.calibrationContract.getCalibrationContracts(payload);
        if (res?.code === 1) {
            setContracts((prev) => [
                ...prev,
                ...(res.result?.calibrationContracts || []),
            ])
            setTotalRecord(res.result.totalResults || 0);
        }
    };

    const onDetail = (item) => {
        navigate(staticPath.viewCalibrationContract + "/" + (item.id || item._id));
    };

    const onSearch = (values) => {
        setContracts([]);
        setValueFilter(values);
        if (page !== 1)
            setPage(1);
        else
            fetchContracts(1, values);
    };

    const resetSearch = () => {
        setPage(1);
        fetchContracts(1);
    };

    const onScroll = () => {
        if (contentRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
            if (!loadingMore && scrollTop + clientHeight + 1 >= scrollHeight) {
                loadMoreData();
            }
        }
    };
    const loadMoreData = () => {
        const nextPage = page + 1;
        const totalLoaded = (nextPage - 1) * 6;
        if (totalLoaded >= totalRecord) return;
        setLoadingMore(true);
        setPage(nextPage);
    };

    return (
        <Form className="search-form" form={searchForm} layout="vertical">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 56,
                    background: '#23457b',
                    color: '#f5f5f5',
                    padding: '0 16px',
                    fontWeight: 600,
                    fontSize: 20,
                    boxSizing: 'border-box',
                    flexShrink: 0
                }}
            >
                <ArrowLeftOutlined
                    style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                    onClick={() => navigate(-1)}
                />
                <span style={{ flex: 1 }}>{t("menu.contract.calibration")}</span>
                <FilterOutlined
                    onClick={() => setOpenFilter(true)}
                    style={{ fontSize: 22, marginRight: 6, cursor: "pointer", position: "relative" }}
                />
                {valueFilter ? (
                    <CheckOutlined
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: 12,
                            color: "green",
                        }}
                    />
                ) : (
                    <CloseOutlined
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            fontSize: 12,
                            color: "red",
                        }}
                    />
                )}
            </div>
            <div
                ref={contentRef}
                className="ticket-list p-1"
                style={{
                    padding: 16,
                    background: contracts.length !== 0 ? "#f5f5f5" : "#fff",
                    height: "calc(100vh - 121px)",
                    overflowY: "auto",
                }}
                onScroll={onScroll}
            >
                {contracts.map((item, idx) => (
                    <Card
                        key={item._id || item.id || idx}
                        className="mb-2 my-2"
                        bodyStyle={{ padding: 12 }}
                        onClick={() => onDetail(item)}
                    >
                        <Row align="middle">
                            <Col span={20}>
                                <div>
                                    <b>{t("amc.manager.table.contract_no")}: </b>
                                    {item?.contractNo}
                                </div>
                                <div>
                                    <b>{t("calibration_contract.service_contractor")}: </b>
                                    {item?.serviceContractor?.serviceContractorName}
                                </div>
                                <div>
                                    <b>{t("amc.manager.table.customer")}: </b>
                                    {item?.customer?.customerName}
                                </div>
                                <div>
                                    <b>{t("calibration_contract.expiration_date")}: </b>
                                    {parseDate(item?.expirationDate)}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
                {contracts.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "#999", backgroundColor: "#ffffff" }}>
                        {t("common.no_data") || "Không có dữ liệu"}
                    </div>
                )}
            </div>
            <CardFilterContract
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onSearch={onSearch}
                onReFeshFilter={resetSearch}
            />
        </Form>
    );
}
