import { Col, Row, Button, Radio, Form, Dropdown, Menu } from "antd";
import React, { useRef, useState, useEffect } from "react";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import useCalibrationWorkContext from "../../contexts/calibrationWorkContext";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { PAGINATION } from "../../utils/constant";
import CardPropertyInspection from "./CardPropertyInspection";
import CardFilterPropertyInspection from "./CardFilterPropertyInspection";
import { cleanEmptyValues } from "../../helper/check-search-value";
export default function PropertyInspection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchForm] = Form.useForm();
  const { updateSearchValue, searchValue } = useCalibrationWorkContext();
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [propertyInspections, setPropertyInspections] = useState([]);
  const [sortOrder, setSortOrder] = useState(-1);
  const [sortField, setSortField] = useState("createdAt");
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [valueFilter, setValueFilter] = useState(null);
  const contentRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialGroupStatus = queryParams.get("groupStatus") || null;

  useEffect(() => {
    searchForm.setFieldsValue(searchValue);
  }, []);

  useEffect(() => {
    fetchGetPropertyInspections(1);
  }, [valueFilter, sortField, sortOrder]);

  useEffect(() => {
    if (initialGroupStatus) {
      searchForm.setFieldsValue({
        ...searchForm.getFieldsValue(),
        groupStatus: initialGroupStatus,
      });
      fetchGetPropertyInspections(1);
    }
  }, [initialGroupStatus]);

  useEffect(() => {
    if (page > 1) {
      fetchGetPropertyInspections();
    }
  }, [page]);

  const sortMenu = (
    <Menu
      onClick={({ key }) => onSelectSortField(key)}
      items={[
        {
          label: (
            <span>
              {sortField === "createdAt" ? "✔️ " : ""}
              {t("preventiveSchedule.list.sort.by_created")}
            </span>
          ),
          key: "createdAt",
        },
        {
          label: (
            <span>
              {sortField === "updatedAt" ? "✔️ " : ""}
              {t("preventiveSchedule.list.sort.by_updated")}
            </span>
          ),
          key: "updatedAt",
        },
      ]}
    />
  );
  const fetchGetPropertyInspections = async (_page, value) => {
    let payload = {
      ...cleanEmptyValues(value || {}),
      page: _page || page,
      limit: PAGINATION.limit,
      ...searchForm.getFieldsValue(),
      sortBy: sortField,
      sortOrder,
      ...valueFilter,
    };
    const res =
      await _unitOfWork.propertyInspection.getPropertyInspections(payload);
    updateSearchValue({ ...payload });
    if (res && res.code === 1) {
      if (payload.page > 1) {
        setLoadingMore(false);
        setPropertyInspections((prev) => [...prev, ...res?.results]);
      } else {
        if (contentRef && contentRef.current) {
          contentRef.current.scrollTo(0, 0);
        }
        setPropertyInspections(res?.results || []);
      }
      setTotalRecord(res?.totalResults);
    }
  };
  const onSearchFilter = (_valueFilter) => {
    const filter = Object.keys(cleanEmptyValues(_valueFilter)).length === 0 ? null : cleanEmptyValues(_valueFilter);
    setPropertyInspections([]);
    setValueFilter(filter);
    if (page !== 1)
      setPage(1);
    else
      fetchGetPropertyInspections(1, filter);
  };

  const onToggleSortOrder = () => {
    setSortOrder(sortOrder * -1);
  };

  const onSelectSortField = (key) => {
    setSortField(key);
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
  const onRefeshPage = () => {
    setPage(1);
    fetchGetPropertyInspections(1);
  };
  return (
    <div className="my-breakdown-container">
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
          <span style={{ flex: 1 }}>{t("propertyInspection.title_menu")}</span>
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

        <Row
          className="my-breakdown-status mt-2"
          align="middle"
          justify="space-between"
        >
          <Col span={24} style={{ display: "flex", justifyContent: "flex-end" }}>
            <Dropdown
              overlay={sortMenu}
              trigger={["click"]}
            >
              <Button className="sort-btn">
                {t("preventiveSchedule.common.sort_label")}
              </Button>
            </Dropdown>
            <Button
              onClick={onToggleSortOrder}
              style={{ marginLeft: "12px", marginRight: "12px" }}
            >
              {sortOrder === 1 ? (
                <SortAscendingOutlined
                  className="icon-filter"
                  style={{ cursor: "pointer", fontSize: 20, color: "#10426d" }}
                />
              ) : (
                <SortDescendingOutlined
                  className="icon-filter"
                  style={{ cursor: "pointer", fontSize: 20, color: "#10426d" }}
                />
              )}
            </Button>
          </Col>
        </Row>
        {totalRecord > 0 && (
          <Row>
            <Col span={24} className="text-right pr-3 mt-2">
              <b>
                {t("preventiveSchedule.list.total", { count: totalRecord })}
              </b>
            </Col>
          </Row>
        )}
        {totalRecord === 0 && <div>No data</div>}

        <div
          ref={contentRef}
          className="ticket-list p-1"
          style={{
            padding: 16,
            background: "#fff",
            maxHeight: "calc(100vh - 121px)",
            overflowY: "auto",
          }}
          onScroll={onScroll}
        >
          {propertyInspections.map((sp) => (
            <div key={sp.id || sp._id}>
              <CardPropertyInspection
                propertyInspection={sp}
                refresh={onRefeshPage}
              />
            </div>
          ))}
        </div>
        <CardFilterPropertyInspection
          onSearch={onSearchFilter}
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          onReFeshFilter={() => {
            setValueFilter(null);
            onRefeshPage();
          }}
        />
      </Form>
    </div>
  );
}
