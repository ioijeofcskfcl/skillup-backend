const pool = require("../db/index");
const AppError = require("../utils/utilsAppError");

const createPricing = async ({ title, price, description, features }) => {
    const result = await pool.query(
        `
        INSERT INTO pricing
        (
            title,
            price,
            description,
            features
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [
            title,
            price,
            description || null,
            features || [],
        ],
    );

    return result.rows[0];
};

const getAllPricing = async () => {
    const result = await pool.query(
        `
        SELECT *
        FROM pricing
        ORDER BY price ASC
        `,
    );

    return result.rows;
};

const getPricingById = async (id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM pricing
        WHERE id = $1
        `,
        [id],
    );

    if (result.rows.length === 0) {
        throw new AppError("Pricing topilmadi.", 404);
    }

    return result.rows[0];
};

const updatePricing = async (id, data) => {
    const oldPricing = await pool.query(
        `
        SELECT *
        FROM pricing
        WHERE id = $1
        `,
        [id],
    );

    if (oldPricing.rows.length === 0) {
        throw new AppError("Pricing topilmadi.", 404);
    }

    const old = oldPricing.rows[0];

    const title = data.title ?? old.title;
    const price = data.price ?? old.price;
    const description = data.description ?? old.description;
    const features = data.features ?? old.features;

    const result = await pool.query(
        `
        UPDATE pricing
        SET
            title = $1,
            price = $2,
            description = $3,
            features = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
        `,
        [
            title,
            price,
            description,
            features,
            id,
        ],
    );

    return result.rows[0];
};

const deletePricing = async (id) => {
    const pricing = await pool.query(
        `
        SELECT id
        FROM pricing
        WHERE id = $1
        `,
        [id],
    );

    if (pricing.rows.length === 0) {
        throw new AppError("Pricing topilmadi.", 404);
    }

    await pool.query(
        `
        DELETE FROM pricing
        WHERE id = $1
        `,
        [id],
    );
};

module.exports = {
    createPricing,
    getAllPricing,
    getPricingById,
    updatePricing,
    deletePricing,
};