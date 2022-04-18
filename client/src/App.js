import { useEffect, useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Landing from "./components/Landing";
import MakeMusicVideo from "./components/MakeMusicVideo";
import Footer from "./components/Footer";

import Notification from "./components/Notification";
import NotificationContext from "./context/NotificationContext";

const App = () => {
    // #region Notification
    const [notification, setNotification] = useState({
        message: null,
        isShown: false,
    });

    const showNotification = (message) => {
        closeNotification();

        setNotification({
            message: message,
            isShown: true,
        });
    };

    const closeNotification = () => {
        setNotification({
            message: null,
            isShown: false,
        });
    };

    let notificationClearTimeout = null;
    useEffect(() => {
        clearTimeout(notificationClearTimeout);
        notificationClearTimeout = setTimeout(closeNotification, 7_000);
    }, [notification.isShown]);
    // #endregion

    return (
        <Router>
            <NotificationContext.Provider value={{ showNotification }}>
                <Header />
                <Routes>
                    <Route exact path="/" element={<Landing />} />
                    <Route exact path="/make" element={<MakeMusicVideo />} />
                </Routes>
                <Footer />
                <Notification
                    notification={notification}
                    closeNotification={closeNotification}
                />
            </NotificationContext.Provider>
        </Router>
    );
};

export default App;
