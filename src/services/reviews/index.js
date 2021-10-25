import express from "express";
import { getReviewsJSON, writeReviewsJSON } from "../../lib/fs-tools.js";

const reviewsRouter = express.Router();


reviewsRouter.get("/",async (req, res, next) => {

    try {
        const reviews = await getReviewsJSON()
        console.log(reviews)
    } catch (error) {
        next(error)
    }

});

reviewsRouter.put("/:id", (req, res, next) => {});

reviewsRouter.delete("/id", (req, res, next) => {});

reviewsRouter.post("/:productId", (req, res, next) => {});

reviewsRouter.get("/:productId", (req, res, next) => {});


export default reviewsRouter