function Input({ register , label , error , type , name , rules}){
    return (
        <>
            <label>{label}</label>
            <input type={type} name={name} {...register(name , rules)} />
            {error?.message}
        </>
    )
}
export default Input