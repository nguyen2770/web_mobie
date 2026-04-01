import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Loading from "./components/common/Loading";
import BaseLayout from "./components/layout/BaseLayout";
import useAuth from "./contexts/authContext";
import { flatRoutes, staticPath } from "./router/RouteConfig";
import {
  flatUnAuthenConfig
} from "./router/RouteUnAuthenConfig";
// import usePushNotifications from "./hooks/usePushNotifications";
// import UAParser from 'ua-parser-js';
import { notification } from "antd";
import { useTranslation } from "react-i18next";
import { socket } from "./socket";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

function App(props) {
  const [loadingFirst, setLoadingFirst] = useState(false);
  // const parser = new UAParser();
  const [openPermissionNotification, setOpenPermissionNotification] =
    useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  // const {
  //   userConsent,
  //   pushNotificationSupported,
  //   userSubscription,
  //   onClickAskUserPermission,
  //   onClickSusbribeToPushNotification,
  //   setPushServerSubscriptionId
  // } = usePushNotifications();
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();

  useEffect(() => { }, [isAuthenticated]);
  // useEffect(() => {
  //   if (!(!pushNotificationSupported || userConsent === 'granted')) {
  //     setOpenPermissionNotification(true)
  //   }
  // }, [pushNotificationSupported, userConsent])
  // useEffect(() => {
  //   if (userConsent === 'granted' && isAuthenticated) {
  //     onClickSusbribeToPushNotification();
  //   }
  // }, [userConsent, isAuthenticated])
  // useEffect(() => {
  //   if (userSubscription && isAuthenticated) {
  //     susbscriptionDevice();
  //   }
  // }, [userSubscription, isAuthenticated])
  // const susbscriptionDevice = async () => {
  //   const payload = {
  //     ...parser.getDevice(),
  //     ...parser.getBrowser(),
  //     subscription: userSubscription
  //   }
  //   let res = await _unitOfWork.notification.susbscription(payload)
  //   if (res && res.code === 1) {
  //     setPushServerSubscriptionId(res.data.susbscriptionId)
  //     localStorage.setItem(STORAGE_KEY.SUSBSCRIPTION_ID, res.data.susbscriptionId);
  //   }
  // }
  // const onClickOkPermissionNotification = () => {
  //   onClickAskUserPermission();
  //   setOpenPermissionNotification(false);
  // };
  useEffect(() => {
    if (isAuthenticated && user && (user.id || user._id)) {
      const userId = user.id || user._id;
      socket.connect();

      socket.on("connect", () => {
        // console.log("Socket connected! ID:", socket.id);
        // alert("Socket connected! ID:", socket.id);
        socket.emit("join", userId);
      });

      return () => {
        socket.off("connect");
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user]);
  useEffect(() => {
    const handleNewNotification = (newNotif) => {
      notification.info({
        message: newNotif.Title || 'Có thông báo mới',
        description: newNotif.text || 'Bạn nhận được 1 thông báo mới.',
      });
    };
    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [])
  if (loadingFirst) {
    return <Loading />;
  }
  if (isAuthenticated === undefined) {
    return <Loading />;
  } else if (isAuthenticated === false) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/login" element={<Login />} index />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<Register />} />
          {flatUnAuthenConfig.map((item) => {
            return (
              <Route
                path={item.path}
                element={<item.component />}
                key={item.path}
              />
            );
          })}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  } else {
    return (
      <div className="App">
        <BaseLayout {...props} user={user} onLogout={logout}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="*"
                element={<Navigate to={staticPath.realtime} replace />}
              />
              {flatRoutes().map((item) => {
                return (
                  <Route
                    path={item.path}
                    element={<item.component />}
                    key={item.path}
                  />
                );
              })}
              {flatUnAuthenConfig.map((item) => {
                return (
                  <Route
                    path={item.path}
                    element={<item.component />}
                    key={item.path}
                  />
                );
              })}
            </Routes>
          </Suspense>
        </BaseLayout>
        {/* <Modal
          title={t("notification.get_instant_notifications")}
          open={openPermissionNotification}
          onCancel={() => setOpenPermissionNotification(false)}
          onOk={onClickOkPermissionNotification}
          okText={t("common_buttons.apply")}
          cancelText={t("common_buttons.cancel")}
        >
          <p>{t("notification.comfirm_mes_notification")}</p>
        </Modal> */}
      </div>
    );
  }
}

export default App;
