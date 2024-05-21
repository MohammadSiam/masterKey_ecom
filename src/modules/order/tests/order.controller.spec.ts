import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from 'nestjs-pino';
import { OrderController } from '../controller/order.controller';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderService } from '../services/order.service';

const mockId = '123';
const mockOrder: CreateOrderDto = {
  strUniqueId: '6a8b4acf-22bd-42f7-80b1-3a54c3c0d54e',
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
  create: jest.fn().mockReturnValue(mockOrder),
  findAll: jest.fn().mockReturnValue([mockOrder]),
  findOne: jest.fn().mockReturnValue(mockOrder),
  update: jest.fn().mockReturnValue(mockOrder),
  delete: jest.fn().mockReturnValue(mockOrder),
};

describe('OrdersController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule.forRoot()],
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create order data', async () => {
    const expectedOutput = await controller.create(mockOrder);
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(service.create).toHaveBeenCalledWith(mockOrder);
    expect(expectedOutput).toEqual(mockOrder);
  });

  it('should find all order data', async () => {
    const expectedOutput = await controller.findAll();
    expect(service.findAll).toHaveBeenCalledTimes(1);
    expect(expectedOutput).toEqual([mockOrder]);
  });

  it('should find order data by id', async () => {
    const expectedOutput = await controller.findOne(mockId);
    expect(service.findOne).toHaveBeenCalledTimes(1);
    expect(service.findOne).toHaveBeenCalledWith(mockId);
    expect(expectedOutput).toEqual(mockOrder);
  });

  it('should update order data by id and payload', async () => {
    const expectedOutput = await controller.update(mockId, mockOrder);
    expect(service.update).toHaveBeenCalledTimes(1);
    expect(service.update).toHaveBeenCalledWith(mockId, mockOrder);
    expect(expectedOutput).toEqual(mockOrder);
  });

  it('should delete order data by id', async () => {
    const expectedOutput = await controller.remove(mockId);
    expect(service.remove).toHaveBeenCalledTimes(1);
    expect(service.remove).toHaveBeenCalledWith(mockId);
    expect(expectedOutput).toEqual(mockOrder);
  });
});
