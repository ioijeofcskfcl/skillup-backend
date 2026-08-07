const mentorService = require("../services/mentor.service");

const createMentor = async (req, res, next) => {
    try {
        const mentor = await mentorService.createMentor({
            fullname: req.body.fullname,
            profession: req.body.profession,
            bio: req.body.bio,
            image_url: req.body.image_url,
        });

        return res.status(201).json({
            success: true,
            message: "Mentor muvaffaqiyatli yaratildi.",
            data: mentor,
        });
    } catch (error) {
        next(error);
    }
};

const getAllMentors = async (req, res, next) => {
    try {
        const mentors = await mentorService.getAllMentors();

        return res.status(200).json({
            success: true,
            data: mentors,
        });
    } catch (error) {
        next(error);
    }
};

const getMentorById = async (req, res, next) => {
    try {
        const mentor = await mentorService.getMentorById(
            req.params.id,
        );

        return res.status(200).json({
            success: true,
            data: mentor,
        });
    } catch (error) {
        next(error);
    }
};

const updateMentor = async (req, res, next) => {
    try {
        const mentor = await mentorService.updateMentor(
            req.params.id,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Mentor muvaffaqiyatli yangilandi.",
            data: mentor,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMentor = async (req, res, next) => {
    try {
        await mentorService.deleteMentor(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Mentor muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createMentor,
    getAllMentors,
    getMentorById,
    updateMentor,
    deleteMentor,
};