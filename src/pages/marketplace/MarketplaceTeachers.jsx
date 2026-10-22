import { useDispatch, useSelector } from "react-redux";
import { getTeachers } from "../../features/marketplace/marketplaceTeacherSlice.js";
import "../../assets/css/marketplace/MarketplaceTeachers.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function MarketplaceTeachers() {
    const dispatch = useDispatch();


    const [searchInput, setSearchInput] = useState("");
    const [subject, setSubject] = useState("");
    const [stage, setStage] = useState("");

    const handleSearch = (event) => {
        event.preventDefault();

        dispatch(
            getTeachers({
                search: searchInput.trim(),
                subject,
                stage,
            })
        );
    };

    const handleReset = () => {
        setSearchInput("");
        setSubject("");
        setStage("");

        dispatch(getTeachers());
    };


    const { teachers, loading, error } = useSelector(
        (state) => state.marketplace
    );

    useEffect(() => {
        dispatch(getTeachers());
    }, [dispatch]);

    if (loading) {
        return (
            <main className="marketplace-page">
                <div className="marketplace-status">
                    <span className="marketplace-spinner" />
                    <p>Finding the right teachers for you...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="marketplace-page">
                <div className="marketplace-status marketplace-error">
                    <h2>Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={() => dispatch(getTeachers())}>
                        Try again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="marketplace-page">
            <section className="marketplace-hero">
                <div className="marketplace-hero-content">
                  <span className="marketplace-eyebrow">
                    YOUR LEARNING JOURNEY STARTS HERE
                  </span>

                    <h1>
                        Learn from the <span>right teacher.</span>
                    </h1>

                    <p>
                        Discover dedicated teachers, explore their subjects, and find
                        the right fit for your educational goals.
                    </p>

                    <a href="#teachers-list" className="marketplace-hero-button">
                        Explore teachers <span aria-hidden="true">↓</span>
                    </a>
                </div>

                <div className="marketplace-hero-decoration" aria-hidden="true">
                    <div className="hero-orbit hero-orbit-one" />
                    <div className="hero-orbit hero-orbit-two" />
                    <div className="hero-book">
                        <span>✦</span>
                        <strong>Learn</strong>
                        <span>Grow · Achieve</span>
                    </div>
                    <span className="hero-floating hero-floating-one">Aa</span>
                    <span className="hero-floating hero-floating-two">∑</span>
                    <span className="hero-floating hero-floating-three">✳</span>
                </div>
            </section>


            <section className="marketplace-filters">
                <form onSubmit={handleSearch} className="marketplace-filter-form">
                    <div className="marketplace-search-field">
                        <label htmlFor="teacher-search">Search teachers</label>

                        <div className="marketplace-search-input-wrap">
                            <span aria-hidden="true">⌕</span>

                            <input
                                id="teacher-search"
                                type="search"
                                placeholder="Name, subject, or bio..."
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="marketplace-filter-field">
                        <label htmlFor="teacher-subject">Subject</label>

                        <select
                            id="teacher-subject"
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                        >
                            <option value="">All subjects</option>
                            <option value="Arabic">Arabic</option>
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                            <option value="Mathematics">Mathematics</option>
                            <option value="Math">Math</option>
                            <option value="Physics">Physics</option>
                            <option value="Chemistry">Chemistry</option>
                            <option value="Biology">Biology</option>
                            <option value="History">History</option>
                            <option value="Geography">Geography</option>
                            <option value="Computer Science">Computer Science</option>
                        </select>
                    </div>

                    <div className="marketplace-filter-field">
                        <label htmlFor="teacher-stage">Academic stage</label>

                        <select
                            id="teacher-stage"
                            value={stage}
                            onChange={(event) => setStage(event.target.value)}
                        >
                            <option value="">All stages</option>
                            <option value="Primary 1">Primary 1</option>
                            <option value="Primary 2">Primary 2</option>
                            <option value="Primary 3">Primary 3</option>
                            <option value="Primary 4">Primary 4</option>
                            <option value="Primary 5">Primary 5</option>
                            <option value="Primary 6">Primary 6</option>
                            <option value="Preparatory 1">Preparatory 1</option>
                            <option value="Preparatory 2">Preparatory 2</option>
                            <option value="Preparatory 3">Preparatory 3</option>
                            <option value="Secondary 1">Secondary 1</option>
                            <option value="Secondary 2">Secondary 2</option>
                            <option value="Secondary 3">Secondary 3</option>
                        </select>
                    </div>

                    <button type="submit" className="marketplace-apply-button">
                        Search
                    </button>

                    <button
                        type="button"
                        className="marketplace-reset-button"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </form>
            </section>


            <section className="marketplace-teachers-section" id="teachers-list">
                <div className="marketplace-section-heading">
                    <div>
                        <span className="marketplace-eyebrow">MEET YOUR EDUCATORS</span>
                        <h2>Explore our teachers</h2>
                        <p>Find an educator who matches your learning journey.</p>
                    </div>

                    <div className="marketplace-teacher-count">
                        <strong>{teachers?.length || 0}</strong>
                        <span>{teachers?.length === 1 ? "Teacher" : "Teachers"}</span>
                    </div>
                </div>

                {!teachers || teachers.length === 0 ? (
                    <div className="marketplace-empty">
                        <span className="marketplace-empty-icon">✦</span>
                        <h3>No teachers available yet</h3>
                        <p>Check back soon to discover new teachers.</p>
                    </div>
                ) : (
                    <div className="marketplace-teachers-grid">
                        {teachers.map((teacher) => {
                            const profile = teacher.teacher_profile || {};
                            const initials = (teacher.name || "T")
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase();

                            return (
                                <article className="marketplace-teacher-card" key={teacher.id}>
                                    <div className="teacher-card-top">
                                        <div className="teacher-avatar">
                                            {initials}
                                        </div>

                                        <span className="teacher-card-badge">
                      <span>✦</span> Educator
                    </span>
                                    </div>

                                    <div className="teacher-card-content">
                                        <h3>{teacher.name}</h3>

                                        <div className="teacher-subject">
                                            <span className="teacher-info-icon">▤</span>
                                            <span>
                        {profile.subject || "Subject not specified"}
                      </span>
                                        </div>

                                        <div className="teacher-stage">
                                            <span className="teacher-info-icon">◷</span>
                                            <span>
                        {profile.subject_stage || "Stage not specified"}
                      </span>
                                        </div>

                                        <p className="teacher-bio">
                                            {profile.bio || "This teacher hasn't added a bio yet."}
                                        </p>
                                    </div>

                                    <div className="teacher-card-footer">
                                        <span>Ready to learn?</span>
                                        <Link
                                            to={`/marketplace/teachers/${teacher.id}`}
                                            className="teacher-profile-button"
                                        >
                                            View profile <span aria-hidden="true">→</span>
                                        </Link>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </section>
        </main>
    );
}

export default MarketplaceTeachers;
