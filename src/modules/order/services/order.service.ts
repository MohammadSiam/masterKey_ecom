import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) { }

  async findAll() {
    try {
      const orderInfo = await this.orderRepository.find();
      if (orderInfo.length === 0)
        throw new NotFoundException('Could not find order');
      return orderInfo;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const order = await this.orderRepository.findOneBy({ intOrderId: id });
      if (!order) throw new NotFoundException('Could not find order');
      return order;
    } catch (error) {
      throw error;
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    if (!createOrderDto.strCustomerName || !createOrderDto.strCustomerPhone || !createOrderDto.intProductId) {
      throw new BadRequestException('Customer name, phone, and productId must be provided');
    }
    try {
      // check if product exists in inventory
      const inventoryInfo = await this.orderRepository
        .createQueryBuilder('o')
        .leftJoinAndSelect('tblInventory', 'i', 'i.intProductId = :productId', { productId: createOrderDto.intProductId })
        .select([
          'i.intQuantity AS InventoryQuantity'
        ])
        .getRawOne();

      if (!inventoryInfo) throw new BadRequestException('Product not found in inventory');
      // 
      const { InventoryQuantity } = inventoryInfo;
      if (InventoryQuantity <= 0) throw new BadRequestException('Insufficient inventory quantity');

      // create order
      const orderCode = uuidv4();
      const order = await this.orderRepository.save({
        strUniqueId: orderCode,
        ...createOrderDto,
      });
      if (!order) throw new InternalServerErrorException('Could not save order');

      //update inventory quantity
      const result = await this.orderRepository
        .createQueryBuilder()
        .update('tblInventory')
        .set({ intQuantity: () => "intQuantity - 1" })
        .where('intProductId = :productId', { productId: createOrderDto.intProductId })
        .execute();

      if (result.affected === 0) throw new InternalServerErrorException('Could not update inventory quantity');
      return order;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const info = await this.orderRepository.findOneBy({ intOrderId: id });
    if (!info) throw new NotFoundException('Could not find order');
    try {
      updateOrderDto = {
        ...updateOrderDto,
        dteUpdatedAt: new Date(),
      };
      const order = await this.orderRepository.save({
        ...info,
        ...updateOrderDto,
      });
      if (!order)
        throw new InternalServerErrorException('Could not update order');
      return { message: 'Order updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const info = await this.orderRepository.findOneBy({ intOrderId: id });
    if (!info) throw new NotFoundException('Could not find order');
    try {
      const order = await this.orderRepository.delete({ intOrderId: id });
      if (!order)
        throw new InternalServerErrorException('Could not delete order');
      return { message: 'Order deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
