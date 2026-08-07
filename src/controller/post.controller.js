const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
    try {
        const post = await postService.createPost({
            user_id: req.user.id,
            title: req.body.title,
            content: req.body.content,
            image_url: req.body.image_url,
        });

        return res.status(201).json({
            success: true,
            message: "Post muvaffaqiyatli yaratildi.",
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

const getAllPosts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 10,
        } = req.query;

        const posts = await postService.getAllPosts(
            Number(page),
            Number(limit),
        );

        return res.status(200).json({
            success: true,
            data: posts,
        });
    } catch (error) {
        next(error);
    }
};

const getPostById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(
            req.params.id,
        );

        return res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

const updatePost = async (req, res, next) => {
    try {
        const post = await postService.updatePost(
            req.params.id,
            req.user.id,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Post muvaffaqiyatli yangilandi.",
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

const deletePost = async (req, res, next) => {
    try {
        await postService.deletePost(
            req.params.id,
            req.user.id,
        );

        return res.status(200).json({
            success: true,
            message: "Post muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
};