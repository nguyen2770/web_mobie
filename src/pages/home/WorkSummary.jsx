import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, FileUnknownOutlined, FilterOutlined, MenuOutlined } from "@ant-design/icons";
import { Col, Row, Card, Radio, Popover, Drawer, Form } from "antd";
import { Tiny } from '@ant-design/plots';
import React, { useEffect, useRef, useState } from "react";
import * as _unitOfWork from "../../api";
import { Column, Line } from '@ant-design/plots';
import { formatMillisToHHMM } from "../../helper/date-helper";
import { useTranslation } from "react-i18next";
import CardFilterWorkSummary from "./CardFilterWorkSummary";
import ShowError from "../../components/modal/result/errorNotification";
import { cleanEmptyValues } from "../../helper/check-search-value";
import CardMySchedulePreventive from "../../components/schedulePreventive/CardMySchedulePreventive";
import { jobSummaryType, PAGINATION } from "../../utils/constant";
import dayjs from "dayjs";
import CardJobSummary from "../../components/modal/JobSummary/CardJobSummary";
import { useNavigate } from "react-router-dom";

export default function WorkSummaryDrawer() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [jobSummarys, setJobSummarys] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [searchForm] = Form.useForm();
    const [openFilter, setOpenFilter] = useState(false);
    const [valueFilter, setValueFilter] = useState({
        startDate: dayjs().startOf("day"),
        endDate: dayjs().endOf("day"),
        jobType: jobSummaryType.ALL,
    });
    const [sortOrder, setSortOrder] = useState(-1);
    const [loadingMore, setLoadingMore] = useState(false);
    const contentRef = useRef();

    useEffect(() => {
        if (page > 1) {
            fetchGetJobSummarys(page, valueFilter);
        } else {
            fetchGetJobSummarys(1, valueFilter);
        }
    }, [page, sortOrder]);

    const fetchGetJobSummarys = async (_page, value) => {
        const values = searchForm.getFieldsValue();
        if (values.startDate === null || values.endDate === null) {
            ShowError(
                "topRight",
                t("common.notifications"),
                t("Vui lòng đầy đủ giờ")
            );
            return;
        }
        let payload = {
            ...cleanEmptyValues(value || {}),
            page: _page || page,
            limit: PAGINATION.limit,
            sortBy: "createdAt",
            sortOrder: sortOrder,
            ...values,
        };

        const res = await _unitOfWork.jobSummary.getJobSummary(payload);
        if (res && res.code === 1) {
            setJobSummarys((prev) => [
                ...prev,
                ...(res?.data || [])
            ]);
            setTotalRecord(res?.totalResults);
        }
    };

    const onSearchFilter = (_valueFilter) => {
        setJobSummarys([]);
        setValueFilter(_valueFilter);
        if (page !== 1)
            setPage(1);
        else
            fetchGetJobSummarys(1, _valueFilter);
    };
    const onRefeshPage = () => {
        setPage(1);
        fetchGetJobSummarys(1);
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
                    color: '#fff',
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
                <span style={{ flex: 1 }}>{t("home.job_summary")}</span>
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
                    background: "#e4e0e0",
                    maxHeight: "calc(100vh - 121px)",
                    overflowY: "auto",
                }}
                onScroll={onScroll}
            >
                {jobSummarys.map((item) => (
                    <div key={item.id} className="mb-2">
                        <CardJobSummary
                            JobSummary={item}
                            refresh={onRefeshPage}
                        />
                    </div>
                ))}
            </div>
            <CardFilterWorkSummary
                onSearch={onSearchFilter}
                open={openFilter}
                onClose={() => setOpenFilter(false)}
                onReFeshFilter={() => {
                    setValueFilter({});
                    onRefeshPage();
                }}
            />
        </Form >
    );
};