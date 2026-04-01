import React from 'react';
import { Row, Col, Form, Select, Button, Input, DatePicker, Drawer } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FORMAT_DATE, jobSummaryType, propertyInspectionStatus } from '../../utils/constant';
import { priorityType, schedulePreventiveTaskAssignUserStatus } from '../../utils/schedulePreventive.constant';
import { filterOption } from '../../helper/search-select-helper';
import { useTranslation } from 'react-i18next';
import dayjs from "dayjs";

const CardFilterPropertyInspection = ({ open, onClose, onSearch, onReFeshFilter }) => {
    const { t } = useTranslation();
    const [filterForm] = Form.useForm();

    const handleSubmit = () => {
        const values = filterForm.getFieldsValue();
        if (values.startDate) values.startDate = values.startDate.format("YYYY-MM-DD");
        if (values.endDate) values.endDate = values.endDate.format("YYYY-MM-DD");
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
                    initialValues={{
                        startDate: dayjs().subtract(7, "day").startOf("day"),
                        endDate: dayjs().endOf("day"),
                        jobType: jobSummaryType.ALL,
                    }}
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
                            fontSize: 20
                        }}
                    >
                        <ArrowLeftOutlined
                            style={{ fontSize: 22, marginRight: 16, cursor: 'pointer' }}
                            onClick={onClose}
                        />
                        <span style={{ flex: 1 }}>{t("preventive.filter.title")}</span>
                    </div>

                    <div style={{ padding: 16, background: '#fff' }}>
                        <Row >
                            <Col span={24} className='mb-2'>
                                <Form.Item label={t("propertyInspection.code")} name="code">
                                    <Input
                                        placeholder={t("propertyInspection.placeholder.enter_code")}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24} className='mb-2'>
                                <Form.Item
                                    label={t("propertyInspection.status")}
                                    name="status"
                                    labelAlign="left"
                                >
                                    <Select
                                        showSearch
                                        allowClear
                                        placeholder={t("propertyInspection.placeholder.select_staus")}
                                        options={(propertyInspectionStatus.Options || []).map(
                                            (item) => ({
                                                value: item.value,
                                                label: t(item.label),
                                            }),
                                        )}
                                        filterOption={filterOption}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label={t("propertyInspection.name_user")}
                                    name="nameUser"
                                >
                                    <Input
                                        placeholder={t("propertyInspection.placeholder.name_user")}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: 16,
                            gap: 12,
                            background: '#fff',
                            position: 'sticky',
                            bottom: 0,
                        }}
                    >
                        <Button
                            block
                            onClick={handleReset}
                            style={{ background: '#34c38f', color: '#fff', flex: 1, height: 40, fontWeight: 500, fontSize: 16 }}
                        >
                            {t("common.buttons.reset")}
                        </Button>
                        <Button
                            block
                            onClick={handleSubmit}
                            style={{ background: '#34c38f', color: '#fff', flex: 1, height: 40, fontWeight: 500, fontSize: 16 }}
                        >
                            {t("common.buttons.search")}
                        </Button>
                    </div>
                </Form>
            </Drawer>
        </div>
    );
};

export default CardFilterPropertyInspection;