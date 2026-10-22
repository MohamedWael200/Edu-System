import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssistants,
  createAssistant,
} from "../../features/assistantsSlice.js";
import "../../assets/css/assistants/TeacherAssistants.css";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};

function TeacherAssistants() {
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);

  const {
    assistants,
    loading,
    error,
    createLoading,
    createError,
    createSuccess,
  } = useSelector((state) => state.assistants);

  useEffect(() => {
    dispatch(getAssistants());
  }, [dispatch]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await dispatch(createAssistant(form)).unwrap();

      setForm(initialForm);
      setShowForm(false);

      dispatch(getAssistants());
    } catch {
      // createError is displayed from Redux state
    }
  }

  return (
    <div className="teacher-assistants-page">
      <header className="assistants-header">
        <div>
          <span className="assistants-eyebrow">
            EDUFLOW / TEAM MANAGEMENT
          </span>
          <h1>My Assistants</h1>
          <p>Manage your teaching team and add new assistants.</p>
        </div>

        <button
          type="button"
          className="assistant-primary-btn"
          onClick={() => setShowForm((previous) => !previous)}
        >
          {showForm ? "Close Form" : "+ Add Assistant"}
        </button>
      </header>

      {createSuccess && (
        <div className="assistant-alert assistant-alert-success" role="status">
          {createSuccess}
        </div>
      )}

      {showForm && (
        <section className="assistant-form-card">
          <h2>Add New Assistant</h2>
          <p>Create an account for a new member of your team.</p>

          <form onSubmit={handleSubmit}>
            <div className="assistant-form-grid">
              <label>
                Full Name
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="assistant@example.com"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  minLength={8}
                  required
                />
              </label>
            </div>

            {createError && (
              <div className="assistant-alert assistant-alert-error" role="alert">
                {createError}
              </div>
            )}

            <button
              type="submit"
              className="assistant-primary-btn"
              disabled={createLoading}
            >
              {createLoading ? "Creating..." : "Create Assistant"}
            </button>
          </form>
        </section>
      )}

      <section className="assistants-list-section">
        <div className="assistants-list-heading">
          <div>
            <h2>Team Members</h2>
            <p>{assistants.length} assistants</p>
          </div>
        </div>

        {loading ? (
          <div className="assistants-empty">
            Loading assistants...
          </div>
        ) : error ? (
          <div className="assistant-alert assistant-alert-error" role="alert">
            {error}
            <button
              type="button"
              onClick={() => dispatch(getAssistants())}
            >
              Try Again
            </button>
          </div>
        ) : assistants.length === 0 ? (
          <div className="assistants-empty">
            <div className="assistants-empty-icon">♧</div>
            <h3>No assistants yet</h3>
            <p>Add your first assistant to start building your team.</p>
          </div>
        ) : (
          <div className="assistants-grid">
            {assistants.map((assistant) => (
              <article
                className="assistant-card"
                key={assistant.id}
              >
                <div className="assistant-avatar">
                  {(assistant.name || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <h3>{assistant.name || "Unnamed Assistant"}</h3>
                <p className="assistant-email">
                  {assistant.email || "No email provided"}
                </p>

                <div className="assistant-card-divider" />

                <div className="assistant-detail">
                  <span>Assistant ID</span>
                  <strong>{assistant.id}</strong>
                </div>

                <div className="assistant-detail">
                  <span>Phone</span>
                  <strong>{assistant.phone || "Not provided"}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default TeacherAssistants;