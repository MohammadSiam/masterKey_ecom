import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InventoryService {

  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) { }
  async create(createInventoryDto: CreateInventoryDto) {
    if (!createInventoryDto.intQuantity) throw new BadRequestException('Quantity must be');
    try {
      const inventory: any = await this.inventoryRepository.save(createInventoryDto);
      if (!inventory) throw new InternalServerErrorException('Could not create inventory')
      return inventory;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const inventory: any = await this.inventoryRepository.find();
      if (inventory.length === 0) throw new NotFoundException('No inventory found')
      return inventory;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const inventory: any = await this.inventoryRepository.findOneBy({ intInventoryId: id })
      if (!inventory) throw new NotFoundException('No inventory found');
      return inventory;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const info = await this.inventoryRepository.findOneBy({ intInventoryId: id });
    if (!info) throw new NotFoundException('Could not find inventory');
    try {
      updateInventoryDto = {
        ...updateInventoryDto,
        dteUpdatedAt: new Date(),
      };
      const inventory: any = await this.inventoryRepository.save({
        ...info,
        ...updateInventoryDto
      })
      if (!inventory) throw new InternalServerErrorException('Could not update inventory')
      return { message: 'Inventory updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    const info = await this.inventoryRepository.findOneBy({ intInventoryId: id });
    if (!info) throw new NotFoundException('Could not find inventory');
    try {
      const inventory = await this.inventoryRepository.delete({ intInventoryId: id })
      if (!inventory) throw new InternalServerErrorException('Could not delete inventory');
      return { message: 'Inventory deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
