import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { OrderModule } from '../src/modules/order/order.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../src/modules/order/entities/order.entity';

const mockOrder = {
    intOrderId: 1,
    strUniqueId: '6a8b4acf-22bd-42f7-80b1-3a54c3c0d54e',
    strCustomerName: 'John Doe',
    strCustomerPhone: '+1234567890',
    dteOrderDate: '2024-05-21T12:00:00.000Z',
    dteDeliveryDate: '2024-05-28T12:00:00.000Z',
    decDiscount: 10.5,
    decTotalAmount: 200.75,
    strRemarks: 'Handle with care',
    dteCreatedAt: '2024-05-21T12:00:00.000Z',
    dteUpdatedAt: '2024-05-21T12:00:00.000Z',
};

const mockOrderRepository = {
    findOneBy: jest.fn().mockImplementation(({ intOrderId }) => {
        if (intOrderId === mockOrder.intOrderId) {
            return Promise.resolve(mockOrder);
        }
        return Promise.resolve(null);
    }),
    find: jest.fn().mockResolvedValue([mockOrder]),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    save: jest.fn(dto => {
        return {
            intOrderId: expect.any(Number),
            ...dto,
        }
    }),
};

describe('OrderController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [OrderModule],
        })
            .overrideProvider(getRepositoryToken(Order))
            .useValue(mockOrderRepository)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/order/create (POST)- should create order', () => {
        return request(app.getHttpServer())
            .post('/order/create')
            .send(mockOrder)
            .expect(201)
            .expect(res => {
                expect(res.body.success).toBe(true);
                expect(res.body.data).toEqual(mockOrder);
            });
    });

    it('/order (GET)- should return orders', () => {
        return request(app.getHttpServer())
            .get('/order')
            .expect(res => {
                expect(res.body).toEqual({
                    success: true,
                    data: [mockOrder]
                });
            });
    });

    it('/order/:id (GET) - should return an order', () => {
        return request(app.getHttpServer())
            .get('/order/1')
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({
                    success: true,
                    data: { ...mockOrder },
                });
            });
    });

    it('/order/:id (DELETE) - should remove an order', () => {
        return request(app.getHttpServer())
            .delete('/order/delete/1')
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({
                    success: true,
                    data: {
                        message: 'Order deleted successfully'
                    }
                });
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
