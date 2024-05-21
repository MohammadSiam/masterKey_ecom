import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  readonly strUniqueId: string;
  readonly strCustomerName: string;
  readonly strCustomerPhone: string;
  readonly dteOrderDate: Date;
  readonly dteDeliveryDate: Date;
  readonly decDiscount: number;
  readonly decTotalAmount: number;
  readonly strRemarks: string;
  readonly dteUpdatedAt: Date;
}
