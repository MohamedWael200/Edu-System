
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    downloadMonthlyReport,
    getLinkedStudents,
} from "../../features/parent/parentSlice";
import "../../assets/css/parent/MonthlyReports.css";

const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
];

const now = new Date();
const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

export default function MonthlyReports() {
    const dispatch = useDispatch();

    const {
        linkedStudents,
        studentsLoading,
        studentsError,
        reportLoading,
        reportError,
    } = useSelector((state) => state.parent);

    const [studentId, setStudentId] = useState("");
    const [month, setMonth] = useState(String(previousMonth.getMonth() + 1));
    const [year, setYear] = useState(String(previousMonth.getFullYear()));
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        dispatch(getLinkedStudents());
    }, [dispatch]);

    useEffect(() => {
        if (!studentId && linkedStudents.length > 0) {
            setStudentId(String(linkedStudents[0].id));
        }
    }, [linkedStudents, studentId]);

    const currentYear = now.getFullYear();
    const years = Array.from(
        { length: 6 },
        (_, index) => currentYear - index
    );

    const handleDownload = async (event) => {
        event.preventDefault();
        setSuccessMessage("");

        if (!studentId) {
            return;
        }

        try {
            const result = await dispatch(
                downloadMonthlyReport({
                    studentId,
                    month: Number(month),
                    year: Number(year),
                })
            ).unwrap();

            const pdfBlob = new Blob([result.blob], {
                type: "application/pdf",
            });

            const downloadUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");

            link.href = downloadUrl;
            link.download = result.filename;
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(downloadUrl);

            setSuccessMessage("Your monthly report has been downloaded.");
        } catch {
            // Error is stored in Redux as reportError.
        }
    };

    if (studentsLoading && linkedStudents.length === 0) {
        return (
            <main className="monthly-reports">
                <div className="monthly-reports__state">
                    <span className="monthly-reports__spinner" />
                    <p>Loading your students...</p>
                </div>
            </main>
        );
    }

    if (studentsError && linkedStudents.length === 0) {
        return (
            <main className="monthly-reports">
                <div className="monthly-reports__state monthly-reports__state--error">
                    <h2>Unable to load students</h2>
                    <p>{studentsError}</p>
                    <button
                        type="button"
                        className="monthly-reports__secondary-button"
                        onClick={() => dispatch(getLinkedStudents())}
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="monthly-reports">
            <header className="monthly-reports__header">
                <div className="monthly-reports__heading-icon">PDF</div>

                <div>
                    <p className="monthly-reports__eyebrow">
                        PARENT DASHBOARD
                    </p>
                    <h1>Monthly Performance Reports</h1>
                    <p className="monthly-reports__subtitle">
                        Download your child's academic performance report
                        for a selected month.
                    </p>
                </div>
            </header>

            {linkedStudents.length === 0 ? (
                <section className="monthly-reports__state">
                    <div className="monthly-reports__empty-icon">♧</div>
                    <h2>No linked students found</h2>
                    <p>
                        Link a student to your account before downloading
                        a performance report.
                    </p>
                </section>
            ) : (
                <section className="monthly-reports__card">
                    <div className="monthly-reports__card-heading">
                        <div className="monthly-reports__card-icon">↓</div>
                        <div>
                            <h2>Download a report</h2>
                            <p>
                                Select the student and reporting period below.
                            </p>
                        </div>
                    </div>

                    <form
                        className="monthly-reports__form"
                        onSubmit={handleDownload}
                    >
                        <div className="monthly-reports__field">
                            <label htmlFor="report-student">Student</label>
                            <select
                                id="report-student"
                                value={studentId}
                                onChange={(event) => {
                                    setStudentId(event.target.value);
                                    setSuccessMessage("");
                                }}
                                required
                            >
                                {linkedStudents.map((student) => (
                                    <option
                                        key={student.id}
                                        value={String(student.id)}
                                    >
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="monthly-reports__period">
                            <div className="monthly-reports__field">
                                <label htmlFor="report-month">Month</label>
                                <select
                                    id="report-month"
                                    value={month}
                                    onChange={(event) => {
                                        setMonth(event.target.value);
                                        setSuccessMessage("");
                                    }}
                                    required
                                >
                                    {months.map((item) => (
                                        <option
                                            key={item.value}
                                            value={String(item.value)}
                                        >
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="monthly-reports__field">
                                <label htmlFor="report-year">Year</label>
                                <select
                                    id="report-year"
                                    value={year}
                                    onChange={(event) => {
                                        setYear(event.target.value);
                                        setSuccessMessage("");
                                    }}
                                    required
                                >
                                    {years.map((item) => (
                                        <option key={item} value={String(item)}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {reportError && (
                            <div
                                className="monthly-reports__alert monthly-reports__alert--error"
                                role="alert"
                            >
                                <strong>Download failed</strong>
                                <p>{reportError}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div
                                className="monthly-reports__alert monthly-reports__alert--success"
                                role="status"
                            >
                                {successMessage}
                            </div>
                        )}

                        <div className="monthly-reports__actions">
                            <button
                                type="submit"
                                className="monthly-reports__download-button"
                                disabled={reportLoading || !studentId}
                            >
                                {reportLoading ? (
                                    <>
                                        <span className="monthly-reports__button-spinner" />
                                        Downloading...
                                    </>
                                ) : (
                                    <>
                                        <span aria-hidden="true">↓</span>
                                        Download PDF Report
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <aside className="monthly-reports__note">
                <span className="monthly-reports__note-icon">i</span>
                <p>
                    Reports are available when they have been generated by
                    the system. If a report is not available, try another
                    month or check with your administrator.
                </p>
            </aside>
        </main>
    );
}
