import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderService } from '../services/order.service';

@Controller('order')
@UseGuards(ThrottlerGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get()
  async findAll() {
    try {
      const order: any = await this.orderService.findAll();
      return { success: true, data: order };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data: any = await this.orderService.findOne(+id);
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order: any = await this.orderService.create(createOrderDto);
      return { success: true, data: order };
    } catch (error) {
      throw error;
    }
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    try {
      const data: any = await this.orderService.update(+id, updateOrderDto);
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const data: any = await this.orderService.remove(+id);
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }
}
