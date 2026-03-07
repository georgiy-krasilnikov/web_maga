const express = require("express");
const router = express.Router();
const db = require("../models");

// Главная страница
router.get("/", async (req, res) => {
    const title = "Управление магазином";
    try {
        const [totalProducts, totalDepartments, totalSellers] =
            await Promise.all([
                db.Product.count(),
                db.Department.count(),
                db.Seller.count(),
            ]);
        const totalStoreItems = (await db.Store.sum("count")) || 0;
        res.render("index", {
            title,
            error: "",
            totalProducts,
            totalDepartments,
            totalSellers,
            totalStoreItems,
        });
    } catch (error) {
        res.status(500).render("index", {
            title,
            error: error.message,
            totalProducts: "",
            totalDepartments: "",
            totalSellers: "",
            totalStoreItems: "",
        });
    }
});

module.exports = router;
