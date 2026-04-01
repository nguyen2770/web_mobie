import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import * as _unitOfWork from "../../../api";
import { PAGINATION, reportView } from "../../../utils/constant";
import { useTranslation } from "react-i18next";

const ReportWorkByPerson = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [valueFilter, setValueFilter] = useState({
        startDate: dayjs().subtract(7, "day").startOf("day"),
        endDate: dayjs().endOf("day"),
    });
    const [viewOption, setViewOption] = useState(reportView.summary);
    const [summaryData, setSummaryData] = useState({});
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [totalRecord, setTotalRecord] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const contentRef = useRef(null);

    // useEffect(() => {
    //     if (page === 1) fetchData(1);
    //     else fetchData(page, true);
    // }, [page, viewOption, valueFilter]);

    // useEffect(() => {
    //     const div = contentRef.current;
    //     if (!div) return;
    //     const handleScroll = () => {
    //         const isBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 10;
    //         if (isBottom && rows.length < totalRecord && !loading) setPage(prev => prev + 1);
    //     };
    //     div.addEventListener("scroll", handleScroll);
    //     return () => div.removeEventListener("scroll", handleScroll);
    // }, [rows, totalRecord, loading]);

    const fetchData = async (currentPage = 1, isLoadMore = false) => {

    };
    return (
        <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
            <span>checkecehc</span>
        </div>
    );
};

export default ReportWorkByPerson;