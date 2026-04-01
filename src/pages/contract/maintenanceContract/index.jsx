import { useEffect, useState, useRef } from "react";
import {
    RedoOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
    FilterOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";
import {
    Button,
    Space,
    Form,
    Card,
    Row,
    Col,
    Input,
    Drawer,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { staticPath } from "../../../router/RouteConfig";
import * as _unitOfWork from "../../../api";
import { PAGINATION } from "../../../utils/constant";
import { parseDate } from "../../../helper/date-helper";
import CardFilterAmc from "./CardFilterAmc";
import { cleanEmptyValues } from "../../../helper/check-search-value";

export default function MaintenanceContract() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [amcs, setAmcs] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [page, setPage] = useState(1);
    const [searchForm] = Form.useForm();
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState(null);
    const [sortOrder, setSortOrder] = useState(-1);
    const [loadingMore, setLoadingMore] = useState(false);
    const contentRef = useRef();

    useEffect(() => {
        if (page > 1) {
            fetchAmcs(page, valueFilter);
        } else {
            fetchAmcs(1, valueFilter);
        }
    }, [page, sortOrder]);

    const fetchAmcs = async (_page, value) => {
        let payload = {
            page: _page || page,
            limit: PAGINATION.limit,
            sortBy: 'createdAt',
            sortOrder: sortOrder,
            // ...searchForm.getFieldsValue(),
            ...cleanEmptyValues(value || {}),
        };
        let res = await _unitOfWork.amc.getAmcs(payload);
        if (res && res.code === 1) {
            setAmcs((prev) => [
                ...prev,
                ...(res.result?.amcs || []),
            ])
            setTotalRecord(res.result.totalResults);
        }
    };

    const resetSearch = () => {
        setPage(1);
        fetchAmcs(1);
    };

    const onDetail = (value) => {
        navigate(staticPath.viewMaintenanceContract + "/" + value._id);
    }
    const onSearch = (values) => {
        setAmcs([]);
        setValueFilter(values);
        if (page !== 1)
            setPage(1);
        else
            fetchAmcs(1, values);
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
                <span style={{ flex: 1 }}>{t("menu.contract.maintenance")}</span>
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
                    background: amcs.length !== 0 ? "#f5f5f5" : "#fff",
                    height: "calc(100vh - 121px)",
                    overflowY: "auto",
                }}
                onScroll={onScroll}
            >
                {amcs.map((item, idx) => (
                    <Card
                        key={item._id || item.id || idx}
                        className="mb-2 my-2"
                        bodyStyle={{ padding: 12 }}
                        onClick={() => onDetail(item)}
                    >
                        <Row align="middle">
                            <Col span={20}>
                                <div className="amc-contract-no">
                                    <b>{t("amc.manager.table.contract_no")}: </b>
                                    {item?.amcNo}
                                </div>
                                <div>
                                    <b>{t("calibration_contract.service_contractor")}: </b>
                                    {item?.serviceContractor?.serviceContractorName}
                                </div>
                                <div className="amc-customer">
                                    <b>{t("amc.manager.table.customer")}: </b>
                                    {item?.customer?.customerName}
                                </div>
                                <div className="amc-date">
                                    <b>{t("amc.manager.table.contract_period")}: </b>
                                    {parseDate(item?.requestDate)}
                                </div>
                            </Col>
                        </Row>
                    </Card>
                ))}
                {amcs.length === 0 && (
                    <div style={{ textAlign: "center", padding: "40px", color: "#999", backgroundColor: "#ffffff" }}>
                        {t("common.no_data") || "Không có dữ liệu"}
                    </div>
                )}
            </div>
            <CardFilterAmc
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onSearch={onSearch}
                onReFeshFilter={resetSearch}
            />
        </Form>

    );
}