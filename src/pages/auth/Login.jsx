import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import Input from "../../components/forms/Input.jsx";
import {login} from "../../features/auth/authSlice.js";
import {emailValidation, passwordValidation} from "../../validation/registerValidation.js";

function Login(){
    const { register , handleSubmit , formState: {errors} } = useForm()
    const dispatch = useDispatch();
    const {loading , error} = useSelector((state) => state.auth)


    function onHandleSubmit(data){
        dispatch(login(data))
    }
    return (
        <>
        <h2>Login</h2>
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <Input label="Email" type="email" name="email" register={register} error={errors.email} rules={emailValidation} />
                <Input label="Password" type="password" name="password" register={register} error={errors.password} rules={passwordValidation} />
                <button type="submit">{loading ? "Logging in..." : "Login"}</button>
            </form>

        </>
    )
}
export default Login;