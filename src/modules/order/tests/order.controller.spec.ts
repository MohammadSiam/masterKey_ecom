import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrderController } from '../controller/order.controller';
import { OrderService } from '../services/order.service';

const intOrderId = '123';
const order = {
  strUniqueId: '6a8b4acf-22bd-42f7-80b1-3a54c3c0d54e',
  intProductId: 1,
  strCustomerName: 'John Doe',
  strCustomerPhone: '+1234567890',
  dteOrderDate: new Date('2024-05-21T12:00:00.000Z'),
  dteDeliveryDate: new Date('2024-05-28T12:00:00.000Z'),
  decDiscount: 10.5,
  decTotalAmount: 200.75,
  strRemarks: 'Handle with care',
  dteCreatedAt: new Date('2024-05-21T12:00:00.000Z'),
  dteUpdatedAt: new Date('2024-05-21T12:00:00.000Z'),
};

const mockOrderService = {
  create: jest.fn((dto) => {
    return {
      intOrderId: expect.any(Number),
      ...dto,
    };
  }),
  update: jest.fn().mockImplementation((id, dto) => ({
    intOrderId: id,
    ...dto,
  })),
};

describe('OrderController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderService],
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60,
            limit: 10,
          },
        ]),
      ],
    })
      .overrideProvider(OrderService)
      .useValue(mockOrderService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be created a order', async () => {
    const response = await controller.create(order);

    expect(response).toEqual({
      success: true,
      data: {
        intOrderId: expect.any(Number),
        ...order,
      },
    });

    expect(mockOrderService.create).toHaveBeenCalledWith(order);
  });

  it('should be updated an order', async () => {
    const response = await controller.update(intOrderId, order);

    expect(response).toEqual({
      success: true,
      data: {
        intOrderId: expect.any(Number),
        ...order,
      },
    });
    expect(mockOrderService.update).toHaveBeenCalled();
  });
});
