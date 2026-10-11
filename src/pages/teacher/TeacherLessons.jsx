import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getLessons} from "../../features/teacher/teacherSlice.js";

function TeacherLessons() {
    const dispatch = useDispatch();
    const { lessons , error , loading } = useSelector((state) => state.teacher)

    useEffect(() => {
        dispatch(getLessons())
    }, [dispatch]);

    if (loading) {
        return <p>Loading lessons...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
    return (
<>
    <h2>My Lessons</h2>

    {lessons.map((lesson) => (
        <div key={lesson.id}>
            <hr />

            {/* Lesson */}
            <h3>{lesson.title}</h3>

            <p>
                Published at: {lesson.published_at}
            </p>

            {/* Video */}
            {lesson.video && (
                <div>
                    <h4>Video</h4>

                    <p>Title: {lesson.video.title}</p>
                    <p>File: {lesson.video.file_path}</p>
                    <p>
                        Duration: {lesson.video.duration} seconds
                    </p>
                </div>
            )}

            {/* Sheet */}
            {lesson.sheet && (
                <div>
                    <h4>Sheet</h4>

                    <p>Title: {lesson.sheet.title}</p>

                    <p>
                        Deadline: {lesson.sheet.deadline_hours} hours
                    </p>

                    <h5>Questions</h5>

                    {lesson.sheet.questions.map((question) => (
                        <div key={question.id}>
                            <p>
                                {question.question_text}
                            </p>

                            <p>Options:</p>

                            <ul>
                                {question.options.map((option) => (
                                    <li key={option}>
                                        {option}
                                    </li>
                                ))}
                            </ul>

                            <p>
                                Correct Answer: {question.correct_option}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Exam */}
            {lesson.exam && (
                <div>
                    <h4>Exam</h4>

                    <p>Title: {lesson.exam.title}</p>

                    <p>
                        Deadline: {lesson.exam.deadline_hours} hours
                    </p>

                    <p>
                        Max Attempts: {lesson.exam.max_attempts}
                    </p>

                    <h5>Questions</h5>

                    {lesson.exam.questions.map((question) => (
                        <div key={question.id}>
                            <p>
                                {question.question_text}
                            </p>

                            <p>Options:</p>

                            <ul>
                                {question.options.map((option) => (
                                    <li key={option}>
                                        {option}
                                    </li>
                                ))}
                            </ul>

                            <p>
                                Correct Answer: {question.correct_option}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    ))}
</>


    )
}
export default TeacherLessons;