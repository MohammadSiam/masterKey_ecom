import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tblOrder')
export class Order {
  @PrimaryGeneratedColumn()
  intOrderId: number;

  @Column({ type: 'varchar', nullable: false })
  strUniqueId: string;

  @Column({ type: 'int', nullable: false })
  intProductId: number;

  @Column({ type: 'varchar', nullable: false })
  strCustomerName: string;

  @Column({ type: 'varchar', nullable: false })
  strCustomerPhone: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteOrderDate: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteDeliveryDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  decDiscount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  decTotalAmount: number;

  @Column({ type: 'varchar' })
  strRemarks: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteCreatedAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteUpdatedAt: Date;
}
