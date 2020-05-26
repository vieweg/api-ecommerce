import { Request, Response } from 'express';

import { container } from 'tsyringe';
import UpdateProductQuantitiesService from '@modules/products/services/UpdateProductQuantitiesService';

export default class UpdateProductQuantitiesController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { products } = request.body;
    const updateProductQuantitiesService = container.resolve(
      UpdateProductQuantitiesService,
    );
    const updatedProducts = await updateProductQuantitiesService.execute(
      products,
    );

    return response.json(updatedProducts);
  }
}
