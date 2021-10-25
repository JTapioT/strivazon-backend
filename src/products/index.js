import express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { validationResult } from "express-validator";
import { getReviewsJSON, getProductsJSON, writeProductsJSON } from "../lib/fs-tools.js";
import { productValidationMiddlewares } from "./validation.js";
const productsRouter = express.Router();

productsRouter.get("/", async (req, res, next) => {
  try {
    const products = await getProductsJSON();
    console.log(products);
    res.send(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const products = await getProductsJSON();
    const product = products.find((p) => p._id === req.params.productId);
    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Products with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviewsJSON();
    const reviewsByProductId = reviews.filter(
      (review) => review.productId === req.params.productId
    );
    if (reviewsByProductId.length) {
      res.send(reviewsByProductId);
    } else {
      next(
        createHttpError(404, `No reviews found for ${req.params.productId}`)
      );
    }
  } catch (error) {
    next(error);
  }
});

productsRouter.post(
  "/",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const products = await getProductsJSON();
        const newProduct = {
          _id: uniqid(),
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        products.push(newProduct);
        await writeProductsJSON(products);
        res.status(201).send({ _id: newProduct._id });
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.put(
  "/:productId",
  productValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const products = await getProductsJSON();
        const index = products.findIndex(
          (product) => product._id === req.params.productId
        );
        const productToModify = products[index];
        const updatedFields = { ...req.body, updatedDate: new Date() };
        const updatedProduct = { ...productToModify, ...updatedFields };
        products[index] = updatedProduct;
        await writeProductsJSON(products);
        res.status(200).send({ _id: products[index]._id });
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const products = await getProductsJSON();
    const remainingProducts = products.filter(
      (product) => product.id !== req.params.productId
    );
    await writeProductsJSON(remainingProducts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
export default productsRouter;
