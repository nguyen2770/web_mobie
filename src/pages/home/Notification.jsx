import {
  ArrowLeftOutlined,
  BellOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  EyeInvisibleOutlined,
  MoreOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Drawer,
  Dropdown,
  Form,
  Menu,
  Segmented,
  Space,
  Spin,
  Typography
} from "antd";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import * as _unitOfWork from "../../api";
import {
  notificationStatus,
  PAGINATION
} from "../../utils/constant";

dayjs.extend(relativeTime);
dayjs.locale('vi');

const Notification = ({ open, onClose, onTotalChange }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchText, setSearchText] = useState("");
  const contentRef = useRef(null);
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const _status = Form.useWatch("status", form);
  const { Text } = Typography;
  const navigate = useNavigate();
  useEffect(() => {
    if (open) {
      setPage(1);
      getApproveWorks(1, false);
    } else {
      setData([]);
    }
  }, [open, _status]);

  useEffect(() => {
    const div = contentRef.current;
    if (!div) return;

    const handleScroll = () => {
      const bottom = div.scrollHeight - div.scrollTop <= div.clientHeight + 1;
      if (bottom && data?.length < totalRecord) {
        loadMoreData();
      }
    };
    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, [data, totalRecord]);

  useEffect(() => {
    if (open && page > 1) {
      getApproveWorks(page, true);
    }
  }, [page]);

  const getApproveWorks = async (currentPage = 1, isLoadMore = false) => {
    if (isLoading && !isLoadMore) return;
    setIsLoading(true);
    const payload = { page: currentPage, limit: PAGINATION.limit };
    if (_status === notificationStatus.unread) {
      payload.isOpen = false;
    } else if (_status === notificationStatus.read) {
      payload.isOpen = true;
    }
    const res = await _unitOfWork.notification.getNotificationUsers(payload);
    if (res && res.data) {
      setTotalRecord(res.data.totalResults);
      if (isLoadMore) {
        setData((prev) => [...prev, ...res.data.results]);
      } else {
        setData(res.data.results);
        if (contentRef.current) contentRef.current.scrollTop = 0;
      }
      onTotalChange?.(res.data.countUnRead);
    }
    setIsLoading(false);
  };

  const loadMoreData = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  const handleClickNoti = async (noti) => {
    navigate(noti?.subUrl?.startsWith('/') ? noti?.subUrl : `/${noti?.subUrl}`);
    try {
      await _unitOfWork.notification.readNotification({ id: noti.id });
      setData(prev =>
        prev.map(item => item.id === noti.id ? { ...item, isOpen: true } : item)
      );
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thông báo:", error);
    }
  }
  const handleDeleteNoti = async ({ domEvent }, notiId) => {
    domEvent.stopPropagation();
    try {
      await _unitOfWork.notification.deleteNotificationUser({ id: notiId });
      setData(prev => prev.filter(item => item.id !== notiId));
      const deletedNoti = data.find(n => n.id === notiId);
      if (deletedNoti && !deletedNoti.isOpen) {
        onTotalChange(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái thông báo:", error);
    }
  }
  const handleToggleReadStatus = async ({ domEvent }, notiId, isOpen) => {
    domEvent.stopPropagation();
    try {
      isOpen ? await _unitOfWork.notification.readNotification({ id: notiId })
        : await _unitOfWork.notification.unReadNotification({ id: notiId });
      setData(prev =>
        prev.map(item => item.id === notiId ? { ...item, isOpen: isOpen } : item)
      );
      onTotalChange(prev => isOpen ? Math.max(0, prev - 1) : prev + 1);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  };
  const handleReadAll = async (e) => {
    e.stopPropagation();
    try {
      await _unitOfWork.notification.readAllNotification();
      setData(prev =>
        prev.map(item => !item.isOpen ? { ...item, isOpen: true } : item)
      );
      onTotalChange(0);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
    }
  }
  const formatNotiTime = (createdAt) => {
    const now = dayjs();
    const notiDate = dayjs(createdAt);
    const diffInHours = now.diff(notiDate, 'hour');
    if (diffInHours < 21) {
      return notiDate.fromNow();
    } else {
      return notiDate.format('HH:mm - DD/MM/YYYY');
    }
  };
  const actionNoti = (noti) => {
    return (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu>
            {noti.isOpen === false ? (
              <Menu.Item
                key="1"
                onClick={(info) => handleToggleReadStatus(info, noti.id, true)}
              >
                <span>
                  <CheckOutlined className="mr-2" />
                  {t("notification.mark_as_read")}
                </span>
              </Menu.Item>
            ) : (
              <Menu.Item
                key="2"
                onClick={(info) => handleToggleReadStatus(info, noti.id, false)}
              >
                <span>
                  <EyeInvisibleOutlined className="mr-2" />
                  {t("notification.mark_as_unread")}
                </span>
              </Menu.Item>
            )}
            <Menu.Item
              key="3"
              onClick={(info) => handleDeleteNoti(info, noti.id)}
            >
              <span style={{ color: '#ff4d4f', }}>
                <DeleteOutlined className="mr-2" />
                {t("notification.delete_noti")}
              </span>
            </Menu.Item>
          </Menu>
        }
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ padding: '4px 8px', cursor: 'pointer' }}
        >
          <MoreOutlined
            style={{ fontSize: '16px' }}
          />
        </div>
      </Dropdown>
    );
  };

  return (
    <Drawer
      placement="right"
      closable={false}
      open={open}
      width="100%"
      bodyStyle={{ padding: 0 }}
    >
      <Form form={form}>
        <div style={{ background: "#23457b" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#fff",
              padding: "15px",
              fontWeight: 600,
              fontSize: 20,
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <ArrowLeftOutlined
              style={{ fontSize: 22, marginRight: 16, cursor: "pointer" }}
              onClick={onClose}
            />
            <span style={{ flex: 1 }}>{t("notification.title")}</span>
            <CheckCircleOutlined
              style={{
                padding: '4px 8px',
                fontSize: 24
              }}
              onClick={(e) => handleReadAll(e)}
            />
          </div>
          <div
            style={{
              overflowX: "auto",
              backgroundColor: "#23457b",
              whiteSpace: "nowrap",
              width: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: 0,
            }}
          >
            <Form.Item name="status">
              <Segmented
                block
                options={notificationStatus.Options.map((opt) => ({
                  value: opt.value,
                  label: (
                    <div style={{ padding: '4px 0' }}>
                      {t(opt.label)}
                    </div>
                  ),
                }))}
                style={{
                  backgroundColor: '#ddddddff',
                  borderRadius: '0',
                  padding: '2px'
                }}
              />
            </Form.Item>
          </div>
        </div>
        <div
          style={{
            padding: "8px 6px 4px 4px",
            height: "calc(100vh - 56px)",
            overflowY: "auto",
          }}
          ref={contentRef}
        >
          {data
            // .filter(
            //   (item) =>
            //     item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
            //     item.description
            //       ?.toLowerCase()
            //       .includes(searchText.toLowerCase())
            // )
            .map((noti) => (
              <div
                key={noti.id}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #b9aeaeff',
                  borderLeft: '1px solid #b9aeaeff',
                  cursor: 'pointer',
                  backgroundColor: noti.isOpen ? '#ffffff' : '#cbdef5ff',
                  marginBottom: '4px',
                  position: 'relative',
                }}
              >
                <div style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                  {actionNoti(noti)}
                </div>
                <a
                  onClick={() => handleClickNoti(noti)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                  }}
                >
                  <Avatar
                    src={noti.icon || "https://resource.medicmms.vn/logo-small.png"}
                    size={40}
                    style={{ marginRight: 12, flexShrink: 0 }}
                  />

                  <div style={{ whiteSpace: 'normal', lineHeight: '1.4' }}>
                    <div style={{ fontWeight: 600, color: '#262626', marginBottom: 2 }}>
                      {noti.title || noti.tag || "Thông báo hệ thống"}
                    </div>

                    <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 4 }}>
                      {noti.text}
                    </Text>

                    <Space style={{ fontSize: 11, color: '#acaaaaff' }}>
                      <ClockCircleOutlined />
                      {/* {new Date(noti.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })} */}
                      {formatNotiTime(noti.createdAt)}
                    </Space>
                  </div>
                </a>
              </div>
            ))}
          {data.length === 0 && !isLoading && (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#999" }}
            >
              <BellOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <Typography.Title level={4}>
                {t("Không có thông báo")}
              </Typography.Title>
              <Typography.Text>
                {t("Bạn chưa có thông báo nào.")}
              </Typography.Text>
            </div>
          )}
          {isLoading && (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Spin size="large" />
              <Typography.Text style={{ display: "block", marginTop: 8 }}>
                {t("Đang tải...")}
              </Typography.Text>
            </div>
          )}
        </div>
      </Form>
    </Drawer>
  );
};

export default Notification;
