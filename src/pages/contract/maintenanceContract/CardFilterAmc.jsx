import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, message, Form, Select, Button, Input, DatePicker, Divider, Drawer } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import * as _unitOfWork from "../../../api";
import { assetType, FORMAT_DATE, priorityLevelStatus } from '../../../utils/constant';
import { dropdownRender, filterOption } from '../../../helper/search-select-helper';
import { useTranslation } from 'react-i18next';

const CardFilterAmc = ({ open, onClose, onSearch, onReFeshFilter }) => {
    const [filterForm] = Form.useForm();
    const { t } = useTranslation();
    const [customers, setCustomers] = useState([]);
    const [servicePackages, setServicePackages] = useState([]);
    const [serviceContractors, setServiceContractors] = useState([]);

    useEffect(() => {
        if (open) {
            fetchGetAllCustomer();
            fetchGetAllServicePackages();
            fetchGetAllServiceContractor();
        }
    }, [open])

    const fetchGetAllCustomer = async () => {
        let res = await _unitOfWork.customer.getAllCustomer();
        if (res && res.code === 1) {
            setCustomers(res.data);
        }
    }
    const fetchGetAllServicePackages = async () => {
        let res = await _unitOfWork.servicePackage.getAllServicePackages();
        if (res && res.code === 1) {
            setServicePackages(res.data);
        }
    }
    const fetchGetAllServiceContractor = async () => {
        let res = await _unitOfWork.serviceContractor.getAllServiceContractors();
        if (res && res.code === 1) {
            setServiceContractors(res.data);
        }
    }
    const handleSubmit = () => {
        const values = filterForm.getFieldsValue();
        onSearch(values);
        onClose();
    };
    const handleReset = () => {
        filterForm.resetFields();
        onReFeshFilter();
        onClose();
    };
    return (
        <div style={{ background: '#f8f8f8' }}>
            <Drawer
                placement="right"
                closable={false}
                open={open}
                width="100%"
                bodyStyle={{ padding: 0 }}
            >
                <Form
                    className="search-form"
                    form={filterForm}
                    layout="vertical"
                >
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
                        }}
                    >
                        <ArrowLeftOutlined
                            style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                            onClick={onClose}
                        />
                        <span style={{ flex: 1 }}>{t("report.filter.title")}</span>
                    </div>

                    <div style={{ padding: 16, background: '#fff' }}>
                        <Row >
                            <Col span={24} className='mb-2'>
                                <Form.Item name="amcNo" label={t("amc.manager.table.contract_no")}>
                                    <Input
                                        placeholder={t("amc.manager.table.contract_no")}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    id=""
                                    labelAlign="left"
                                    label={t("amc.form.service_contractor")}
                                    name="serviceContractor"
                                >
                                    <Select
                                        // size='large'
                                        showSearch
                                        allowClear
                                        placeholder={t("amc.form.service_contractor")}
                                        options={(serviceContractors || []).map((item) => ({
                                            value: item.id,
                                            label: item.serviceContractorName,
                                        }))}
                                        // mode="tags"
                                        filterOption={filterOption}
                                        dropdownStyle={dropdownRender}
                                    ></Select>

                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    id=""
                                    labelAlign="left"
                                    label={t("amc.form.user")}
                                    name="customer"
                                >
                                    <Select
                                        // size='large'
                                        showSearch
                                        allowClear
                                        placeholder={t("amc.form.user")}
                                        options={(customers || []).map((item) => ({
                                            value: item.id,
                                            label: item.customerName,
                                        }))}
                                        // mode="tags"
                                        filterOption={filterOption}
                                        dropdownStyle={dropdownRender}
                                    ></Select>

                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    id=""
                                    labelAlign="left"
                                    label={t("amc.form.service_package")}
                                    name="servicePackage"
                                >
                                    <Select
                                        // size='large'
                                        showSearch
                                        allowClear
                                        placeholder={t("amc.form.service_package")}
                                        options={(servicePackages || []).map((item) => ({
                                            value: item.id,
                                            label: item.servicePackageName,
                                        }))}
                                        // mode="tags"
                                        filterOption={filterOption}
                                        dropdownStyle={dropdownRender}
                                    ></Select>

                                </Form.Item>
                            </Col>
                            <Col span={24} className='mb-2'>
                                <Form.Item name="startDate" label={t("suppliesNeed.list.search.start_label")}>
                                    <DatePicker
                                        placeholder={t("preventive.filter.placeholders.start_date")}
                                        format={FORMAT_DATE}
                                        style={{ width: "100%" }}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} className='mb-2'>
                                <Form.Item name="endDate" label={t("suppliesNeed.list.search.end_label")}>
                                    <DatePicker
                                        placeholder={t("preventive.filter.placeholders.end_date")}
                                        format={FORMAT_DATE}
                                        style={{ width: "100%" }}
                                        allowClear
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <div
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: '#fff',
                        padding: '12px 16px',
                        boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
                        zIndex: 1000,
                    }}
                >
                    <Row gutter={12}>
                        <Col span={12}>
                            <Button
                                block
                                size="large"
                                style={{
                                    backgroundColor: '#34C38F',
                                    color: '#fff',
                                    border: 'none',
                                }}
                                onClick={handleReset}
                            >
                                Xoá
                            </Button>
                        </Col>

                        <Col span={12}>
                            <Button
                                block
                                size="large"
                                style={{
                                    backgroundColor: '#34C38F',
                                    color: '#fff',
                                    border: 'none',
                                }}
                                onClick={handleSubmit}
                            >
                                Nộp
                            </Button>
                        </Col>
                    </Row>
                </div>

            </Drawer>
        </div>

    );
};

export default CardFilterAmc;