import { inject, injectable } from 'tsyringe';

import Product from '../infra/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  id: string;
  quantity: number;
}

@injectable()
class UpdateProductQuantitiesService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute(data: IRequest[]): Promise<Product[]> {
    const updatedProducts = await this.productsRepository.updateQuantity(data);

    return updatedProducts;
  }
}

export default UpdateProductQuantitiesService;
