import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getMe, markAuthInitialized } from "../../features/auth/authSlice.js";
import { storageService } from "../../services/storageService.js";

function AppLayout() {
    const dispatch = useDispatch();

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