import { ApartmentOutlined, SolutionOutlined } from "@ant-design/icons";
import { lazy } from "react";
import { permissionCodeConstant } from "../utils/permissionCodeConstant";

export const inventoryAssetStaticPath = {
    myInventoryAsset: '/myInventoryAsset',
    viewInventoryAsset: '/inventoryAsset/viewInventoryAsset',
    startInventoryAsset: '/inventoryAsset/startInventoryAsset',
    viewMaintenanceinventoryAsset: '/inventoryAsset/viewMaintenanceinventoryAsset',
    calibrationinventoryAsset: '/inventoryAsset/calibrationinventoryAsset',
    viewCalibrationinventoryAsset: "/inventoryAsset/viewCalibrationinventoryAsset",
    repairinventoryAsset: "/inventoryAsset/repairinventoryAsset",
    viewRepairinventoryAsset: "/inventoryAsset/viewRepairinventoryAsset",
};

export const routeinventoryAsset = [
    {
        key: inventoryAssetStaticPath.myInventoryAsset,
        path: inventoryAssetStaticPath.myInventoryAsset,
        label: "Lịch kiểm kê của tôi",
        exact: true,
        icon: <ApartmentOutlined />,
        component: lazy(() => import("../pages/inventoryAsset/InventoryAsset")),
        un_check_permission: true,
    },
    {
        key: inventoryAssetStaticPath.viewInventoryAsset + "/:id",
        path: inventoryAssetStaticPath.viewInventoryAsset + "/:id",
        label: "Chi tiết lịch kiểm kê của tôi",
        exact: true,
        icon: <ApartmentOutlined />,
        component: lazy(() => import("../pages/inventoryAsset/ViewInventoryAsset")),
        un_check_permission: true,
    },
    {
        key: inventoryAssetStaticPath.startInventoryAsset + "/:id",
        path: inventoryAssetStaticPath.startInventoryAsset + "/:id",
        label: "Bắt đầu kiểm kê",
        exact: true,
        icon: <ApartmentOutlined />,
        component: lazy(() => import("../pages/inventoryAsset/StartInventoryAsset")),
        un_check_permission: true,
    },
];
