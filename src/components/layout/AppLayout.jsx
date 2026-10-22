
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
    getMe,
    markAuthInitialized,
    logout,
} from "../../features/auth/authSlice.js";

import { storageService } from "../../services/storageService.js";

function AppLayout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const handleUnauthorized = () => {
            dispatch(logout());
            navigate("/login", { replace: true });
        };

        window.addEventListener(
            "auth:unauthorized",
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                handleUnauthorized
            );
        };
    }, [dispatch, navigate]);

    useEffect(() => {
        const token = storageService.getToken();

        if (token) {
            dispatch(getMe());
        } else {
            dispatch(markAuthInitialized());
        }
    }, [dispatch]);

    return <Outlet />;
}

export default AppLayout;
