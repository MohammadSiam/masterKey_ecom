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
import { Inventory } from 'src/modules/inventory/entities/inventory.entity';

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
    if (!createOrderDto.strCustomerName || !createOrderDto.strCustomerPhone)
      throw new BadRequestException('Customer name and phone must be');
    try {
      const orderCode = uuidv4();
      const order = this.orderRepository.save({
        strUniqueId: orderCode,
        ...createOrderDto,
      });
      if (!order)
        throw new InternalServerErrorException('Could not save order');
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
