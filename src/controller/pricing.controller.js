const pricingService = require("../services/pricing.service");

const createPricing = async (req, res, next) => {
    try {
        const pricing = await pricingService.createPricing({
            title: req.body.title,
            price: req.body.price,
            description: req.body.description,
            features: req.body.features,
        });

        return res.status(201).json({
            success: true,
            message: "Pricing muvaffaqiyatli yaratildi.",
            data: pricing,
        });
    } catch (error) {
        next(error);
    }
};

const getAllPricing = async (req, res, next) => {
    try {
        const pricing = await pricingService.getAllPricing();

        return res.status(200).json({
            success: true,
            data: pricing,
        });
    } catch (error) {
        next(error);
    }
};

const getPricingById = async (req, res, next) => {
    try {
        const pricing = await pricingService.getPricingById(
            req.params.id,
        );

        return res.status(200).json({
            success: true,
            data: pricing,
        });
    } catch (error) {
        next(error);
    }
};

const updatePricing = async (req, res, next) => {
    try {
        const pricing = await pricingService.updatePricing(
            req.params.id,
            req.body,
        );

        return res.status(200).json({
            success: true,
            message: "Pricing muvaffaqiyatli yangilandi.",
            data: pricing,
        });
    } catch (error) {
        next(error);
    }
};

const deletePricing = async (req, res, next) => {
    try {
        await pricingService.deletePricing(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Pricing muvaffaqiyatli o'chirildi.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPricing,
    getAllPricing,
    getPricingById,
    updatePricing,
    deletePricing,
};