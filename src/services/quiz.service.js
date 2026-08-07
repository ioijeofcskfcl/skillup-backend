const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const createQuiz = async ({ course_id, title, description }) => {
    const course = await pool.query(
        "SELECT id FROM courses WHERE id = $1",
        [course_id],
    );

    if (course.rows.length === 0) {
        throw new AppError("Kurs topilmadi.", 404);
    }

    const result = await pool.query(
        `
        INSERT INTO quizzes
        (
            course_id,
            title,
            description
        )
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [course_id, title, description || null],
    );

    return result.rows[0];
};

const getAllQuizzes = async (course_id = "") => {
    let query = `
        SELECT
            q.id,
            q.course_id,
            q.title,
            q.description,
            q.created_at,
            q.updated_at,
            c.title AS course_title
        FROM quizzes q
        INNER JOIN courses c
            ON q.course_id = c.id
    `;

    const values = [];

    if (course_id) {
        values.push(course_id);
        query += ` WHERE q.course_id = $1`;
    }

    query += ` ORDER BY q.created_at DESC`;

    const result = await pool.query(query, values);

    return result.rows;
};

const getQuizById = async (id) => {
    const result = await pool.query(
        `
        SELECT
            q.id,
            q.course_id,
            q.title,
            q.description,
            q.created_at,
            q.updated_at,
            c.title AS course_title
        FROM quizzes q
        INNER JOIN courses c
            ON q.course_id = c.id
        WHERE q.id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    return result.rows[0];
};

const updateQuiz = async (id, data) => {
    const oldQuiz = await pool.query(
        "SELECT * FROM quizzes WHERE id = $1",
        [id],
    );

    if (oldQuiz.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    const quiz = oldQuiz.rows[0];

    const title = data.title ?? quiz.title;
    const description = data.description ?? quiz.description;

    const result = await pool.query(
        `
        UPDATE quizzes
        SET
            title = $1,
            description = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [title, description, id],
    );

    return result.rows[0];
};

const deleteQuiz = async (id) => {
    const quiz = await pool.query(
        "SELECT id FROM quizzes WHERE id = $1",
        [id],
    );

    if (quiz.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    await pool.query(
        "DELETE FROM quizzes WHERE id = $1",
        [id],
    );
};

const createQuestion = async ({
    quiz_id,
    question,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer,
}) => {
    const quiz = await pool.query(
        "SELECT id FROM quizzes WHERE id = $1",
        [quiz_id],
    );

    if (quiz.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    const result = await pool.query(
        `
        INSERT INTO quiz_questions
        (
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
        ],
    );

    return result.rows[0];
};

const getQuizQuestions = async (quiz_id) => {
    const quiz = await pool.query(
        "SELECT id FROM quizzes WHERE id = $1",
        [quiz_id],
    );

    if (quiz.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    const result = await pool.query(
        `
        SELECT
            id,
            quiz_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            created_at
        FROM quiz_questions
        WHERE quiz_id = $1
        ORDER BY created_at ASC
        `,
        [quiz_id],
    );

    return result.rows;
};

const updateQuestion = async (id, data) => {
    const oldQuestion = await pool.query(
        "SELECT * FROM quiz_questions WHERE id = $1",
        [id],
    );

    if (oldQuestion.rows.length === 0) {
        throw new AppError("Savol topilmadi.", 404);
    }

    const old = oldQuestion.rows[0];

    const question = data.question ?? old.question;
    const option_a = data.option_a ?? old.option_a;
    const option_b = data.option_b ?? old.option_b;
    const option_c = data.option_c ?? old.option_c;
    const option_d = data.option_d ?? old.option_d;
    const correct_answer = data.correct_answer ?? old.correct_answer;

    const result = await pool.query(
        `
        UPDATE quiz_questions
        SET
            question = $1,
            option_a = $2,
            option_b = $3,
            option_c = $4,
            option_d = $5,
            correct_answer = $6
        WHERE id = $7
        RETURNING *
        `,
        [
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            id,
        ],
    );

    return result.rows[0];
};

const deleteQuestion = async (id) => {
    const question = await pool.query(
        "SELECT id FROM quiz_questions WHERE id = $1",
        [id],
    );

    if (question.rows.length === 0) {
        throw new AppError("Savol topilmadi.", 404);
    }

    await pool.query(
        "DELETE FROM quiz_questions WHERE id = $1",
        [id],
    );
};

const submitQuiz = async (user_id, quiz_id, answers) => {
    const quiz = await pool.query(
        "SELECT id FROM quizzes WHERE id = $1",
        [quiz_id],
    );

    if (quiz.rows.length === 0) {
        throw new AppError("Quiz topilmadi.", 404);
    }

    const questions = await pool.query(
        `
        SELECT id, correct_answer
        FROM quiz_questions
        WHERE quiz_id = $1
        `,
        [quiz_id],
    );

    if (questions.rows.length === 0) {
        throw new AppError("Quizda savollar mavjud emas.", 400);
    }

    let score = 0;

    for (const question of questions.rows) {
        const userAnswer = answers.find(
            (answer) => answer.question_id === question.id,
        );

        if (
            userAnswer &&
            userAnswer.answer === question.correct_answer
        ) {
            score++;
        }
    }

    const totalQuestions = questions.rows.length;

    const result = await pool.query(
        `
        INSERT INTO quiz_results
        (
            quiz_id,
            user_id,
            score,
            total_questions
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [quiz_id, user_id, score, totalQuestions],
    );

    return {
        result: result.rows[0],
        score,
        totalQuestions,
        percentage: Math.round(
            (score / totalQuestions) * 100,
        ),
    };
};

const getMyQuizResults = async (user_id, quiz_id) => {
    const result = await pool.query(
        `
        SELECT
            qr.id,
            qr.quiz_id,
            qr.user_id,
            qr.score,
            qr.total_questions,
            qr.completed_at,
            q.title AS quiz_title
        FROM quiz_results qr
        INNER JOIN quizzes q
            ON qr.quiz_id = q.id
        WHERE qr.user_id = $1
          AND qr.quiz_id = $2
        ORDER BY qr.completed_at DESC
        `,
        [user_id, quiz_id],
    );

    return result.rows;
};

module.exports = {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    createQuestion,
    getQuizQuestions,
    updateQuestion,
    deleteQuestion,
    submitQuiz,
    getMyQuizResults,
};