export class CreateOrderDto {
  readonly strUniqueId: string;
  readonly intProductId: number;
  readonly strCustomerName: string;
  readonly strCustomerPhone: string;
  readonly dteOrderDate: Date;
  readonly dteDeliveryDate: Date;
  readonly decDiscount: number;
  readonly decTotalAmount: number;
  readonly strRemarks: string;
  readonly dteCreatedAt: Date;
  readonly dteUpdatedAt: Date;
}
