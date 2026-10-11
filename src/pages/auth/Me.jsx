import {useEffect, useState} from "react";
import api from "../../api/api.js";
import {logout} from "../../features/auth/authSlice.js";
import {useDispatch} from "react-redux";

function Me(){
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        async function geMe() {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch (error) {
                setError(error.response?.data?.message || "Something went wrong");
            }
        }
        geMe()
    }, []);
    return (
        <>
            <h2>My Profile</h2>

            {user && (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            )}

            {error && <p>{error}</p>}
            <button onClick={() => dispatch(logout())}>
                Logout
            </button>
        </>
    )
}
export default Me;