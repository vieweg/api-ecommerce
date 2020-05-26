import { Router } from 'express';

import ProductsController from '../controller/ProductsController';
import UpdateProductQuantitiesController from '../controller/UpdateProductQuantitiesController';

const productsRouter = Router();
const productsController = new ProductsController();
const updateProductQuantitiesController = new UpdateProductQuantitiesController();

productsRouter.post('/', productsController.create);

productsRouter.get('/', productsController.index);

productsRouter.post(
  '/update-quantities',
  updateProductQuantitiesController.create,
);

export default productsRouter;
