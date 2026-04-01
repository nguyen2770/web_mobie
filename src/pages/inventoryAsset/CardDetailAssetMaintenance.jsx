import { Button, Card, Col, Dropdown, Image, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { staticPath } from "../../router/RouteConfig";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import * as _unitOfWork from "../../api";
import useAuth from "../../contexts/authContext";
import { checkPermission } from "../../helper/permission-helper";
import { permissionCodeConstant } from "../../utils/permissionCodeConstant";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./index.scss"
const CardDetailAssetMaintenance = ({
  data,
  onClickItem,
  onReload
}) => {
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const { t } = useTranslation();

  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    if (data?.resource?.id) {
      setImgSrc(_unitOfWork.resource.getImage(data?.assetMaintenance?.resource.id));
    }
  }, [data?.resource?.id]);
  const onDeleteAssetMaintenance = async () => {
    let res = await _unitOfWork.inventoryAsset.deleteDepartmentAssetMaintenance({
      id: data.id,
      inventoryAssetDepartment: data.inventoryAssetDepartment
    });
    if (res && res.code === 1) {
      onReload();
    }
  }
  const items = [
    {
      key: '1',
      label: (
        <a target="_blank" onClick={onDeleteAssetMaintenance} rel="noopener noreferrer" >
          Xóa thiết bị khỏi kiểm kê
        </a>
      ),
    }]

  return (
    <Card
      key={data?.assetMaintenance?.id}
      bodyStyle={{ padding: 10 }}
      style={{ margin: 5 }}
    >
      <Row className="justify-space-between">
        <b className="ticket-title ellipsis">{data?.assetMaintenance?.assetName}</b>
        <Dropdown menu={{ items }} placement="bottomRight">
          <Button icon={<EllipsisOutlined />} />
        </Dropdown>
      </Row>
      <Row align="middle">
        <Col span={4}>
          <Image
            width={60}
            height={60}
            src={imgSrc}
            preview={false}
            style={{ borderRadius: "5px", background: "#eee" }}
          // fallback="https://via.placeholder.com/60"
          />
        </Col>

        <Col span={20} style={{ paddingLeft: 10 }}>
          <Row gutter={32} className="asset-info">


            <Col span={24}>
              <span className="ellipsis">
                {t("assetMaintenance.card.model_label")}: {data?.assetMaintenance?.assetModelName}
              </span>
            </Col>
            <Col span={24}>
              <span className="ellipsis">
                {t("calibration.asset_number")}: {data?.assetMaintenance?.assetNumber}
              </span>
            </Col>
            <Col span={24}>
              <span className="ellipsis">
                {t("assetMaintenance.card.serial_label")}: {data?.assetMaintenance?.serial}
              </span>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default CardDetailAssetMaintenance;
