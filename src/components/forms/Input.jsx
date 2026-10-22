import "../../assets/css/Input.css";

function Input({ register, label, error, type = "text", name, rules }) {
    return (
        <div className="form-input-group">
            <label className="form-input-label" htmlFor={name}>
                {label}
            </label>

            <input
                id={name}
                type={type}
                className={`form-input ${error ? "form-input-invalid" : ""}`}
                {...register(name, rules)}
                aria-invalid={!!error}
            />

            {error?.message && (
                <p className="form-input-error" role="alert">
                    {error.message}
                </p>
            )}
        </div>
    );
}

export default Input;
