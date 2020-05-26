import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';
import ICreateOrderDTO from '../dtos/ICreateOrderDTO';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer not find', 400);
    }

    const createOrder: ICreateOrderDTO = { customer, products: [] };
    const productsToUpdateQtd: IUpdateProductsQuantityDTO[] = [];

    await Promise.all(
      products.map(async product => {
        const findProduct = await this.productsRepository.findById(product.id);
        if (!findProduct) {
          throw new AppError('Product not found', 400);
        }
        if (findProduct.quantity < product.quantity) {
          throw new AppError('quantity unavailable', 400);
        }
        createOrder.products.push({
          product_id: findProduct.id,
          price: findProduct.price,
          quantity: product.quantity,
        });
        const newQuantity = findProduct.quantity - product.quantity;
        productsToUpdateQtd.push({ id: findProduct.id, quantity: newQuantity });
      }),
    );

    const order = await this.ordersRepository.create(createOrder);
    await this.productsRepository.updateQuantity(productsToUpdateQtd);

    return order;
  }
}

export default CreateOrderService;
