import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';
import ShowAllProductsService from '@modules/products/services/ShowAllProductsService';

export default class ProductsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const showAllProductsService = container.resolve(ShowAllProductsService);
    const products = await showAllProductsService.execute();

    return response.json(products);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, price, quantity } = request.body;
    const createProductService = container.resolve(CreateProductService);
    const product = await createProductService.execute({
      name,
      price,
      quantity,
    });

    return response.json(product);
  }
}
