import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('tblInventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  intInventoryId: number;

  @Column({ type: 'int', nullable: false })
  intProductId: number;

  @Column({ type: 'int', nullable: false })
  intQuantity: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteCreatedAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  dteUpdatedAt: Date;
}
