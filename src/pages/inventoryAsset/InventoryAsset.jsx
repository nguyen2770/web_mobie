import { useNavigate } from "react-router-dom";
import CardItemInventoryAsset from "./CardItemInventoryAsset";
import { ArrowLeftOutlined, CheckOutlined, CloseOutlined, FilterOutlined, SearchOutlined } from "@ant-design/icons";
import { Col, Form, Radio, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import * as _unitOfWork from "../../api";
import { PAGINATION } from "../../utils/constant";
import { useTranslation } from "react-i18next";
import { inventoryAssetStatus } from "../../utils/inventoryAssetConstant";
import { useForm } from "antd/es/form/Form";

const InventoryAsset = () => {
    const [form] = Form.useForm();
    const [sortOrder, setSortOrder] = useState(-1);
    const [sortField, setSortField] = useState("createdAt");
    const [open, setOpen] = useState(false);
    const [openSearch, setOpenSeach] = useState(false);
    const [valueFilter, setValueFilter] = useState(null);
    const [totalRecord, setTotalRecord] = useState(0);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryAssets, setinventoryAssets] = useState([])
    const contentRef = useRef(null);
    const { t } = useTranslation();
    const _status = Form.useWatch("status", form);
    useEffect(() => {
        const div = contentRef.current;
        if (!div) return;

        const handleScroll = () => {
            const isBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 10;
            if (isBottom && inventoryAssets.length < totalRecord && !isLoading) {
                loadMoreData();
            }
        };

        div.addEventListener("scroll", handleScroll);
        return () => div.removeEventListener("scroll", handleScroll);
    }, [inventoryAssets, totalRecord]);


    useEffect(() => {
        getMyinventoryAssets(page, page > 1);
    }, [page, valueFilter, _status]);


    const onSearchFilter = (_valueFilter) => {
        setValueFilter(_valueFilter);
    }

    const getMyinventoryAssets = async (currentPage = 1, isLoadMore = false) => {
        if (isLoading) return;
        setIsLoading(true);
        let payload = {
            page: currentPage,
            limit: PAGINATION.limit,
            ...valueFilter,
            status: _status ?? inventoryAssetStatus.new
        };
        const res = await _unitOfWork.inventoryAsset.getMyInventoryAssets(
            payload
        );
        if (res && res.results && res.results?.results) {
            setTotalRecord(res.results.totalResults);
            if (isLoadMore) {
                setinventoryAssets(prev => [...prev, ...res.results?.results]);
            } else {
                setinventoryAssets(res.results?.results);
            }
        }
        setIsLoading(false);
    }

    const loadMoreData = () => {
        if (!isLoading) {
            setPage(prev => prev + 1);
        }
    };

    const onRefeshFilter = () => {
        setOpen(false);
        setValueFilter([]);
    }
    const itemStatuses = [{
        label: 'Thêm mới',
        value: inventoryAssetStatus.new
    }, {
        label: 'Đang thực hiện',
        value: inventoryAssetStatus.inProgress
    }, {
        label: 'Chờ duyệt',
        value: inventoryAssetStatus.await_approve
    }, {
        label: 'Đã đóng',
        value: inventoryAssetStatus.done
    }]
    return (
        <div style={{ height: '100vh' }} >
            <Form
                form={form}
                initialValues={{
                    status: inventoryAssetStatus.new
                }}
            >
                <Row
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
                    <Col span={16}>
                        {/* <ArrowLeftOutlined
                        style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                        onClick={() => navigate(-1)}
                    /> */}
                        <span style={{ flex: 1, fontSize: 20 }}>Lịch kiểm kê</span>
                    </Col>
                    {/* <Col
                    span={8}
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 12,
                        color: "#ffffff",
                    }}
                >
                    <div style={{ position: "relative" }}>
                        <FilterOutlined
                            onClick={() => setOpen(true)}
                            style={{ fontSize: 22, marginRight: 12, cursor: "pointer" }}
                        />
                        {valueFilter ? (
                            <CheckOutlined style={{
                                position: 'absolute',
                                top: -5,
                                right: 0,
                                fontSize: 12,
                                color: "green",
                            }} />
                        ) : (
                            <CloseOutlined style={{
                                position: 'absolute',
                                top: -5,
                                right: 0,
                                fontSize: 12,
                                color: "red",
                            }} />
                        )}
                    </div>
                    <SearchOutlined
                        onClick={() => setOpenSeach(true)}
                        style={{ fontSize: 22, cursor: "pointer", paddingRight: "7px" }}
                    />
                </Col> */}
                </Row>
                <div
                    style={{
                        overflowX: "auto",
                        backgroundColor: "#10426d",
                        whiteSpace: "nowrap",
                        width: "100%",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        borderTop: '1px solid white'
                    }}
                >
                    <Form.Item label="" name="status" style={{ marginBottom: 16 }}>
                        <Radio.Group
                            block
                            options={itemStatuses}
                            optionType="button"
                            defaultValue={inventoryAssetStatus.new}
                            className="status-filter-radio-custom"
                            style={{ minWidth: "max-content", display: "inline-block" }}
                        />
                    </Form.Item>
                </div>
            </Form>
            <div
                ref={contentRef}
                style={{
                    overflowY: 'auto',
                    height: 'calc(100vh - 180px)',
                    padding: '0 5px',
                }}
            >
                {inventoryAssets && inventoryAssets.length > 0 ? (
                    inventoryAssets.map(item => (
                        <CardItemInventoryAsset key={item.id} inventoryAsset={item} />
                    ))
                ) : (
                    <p style={{ textAlign: "center", marginTop: 30, color: "#999" }}>
                        {t("common.no_data")}
                    </p>
                )}
            </div>
        </div>
    );
}

export default InventoryAsset;