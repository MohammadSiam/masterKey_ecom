import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { CreateInventoryDto } from '../dto/create-inventory.dto';
import { UpdateInventoryDto } from '../dto/update-inventory.dto';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) { }
  @Get()
  async findAll() {
    try {
      const data: any = await this.inventoryService.findAll();
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data: any = await this.inventoryService.findOne(+id)
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Post('create')
  async create(@Body() createInventoryDto: CreateInventoryDto) {
    const data: any = await this.inventoryService.create(createInventoryDto)
    return { success: true, data };
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() updateInventoryDto: UpdateInventoryDto) {
    try {
      const data: any = await this.inventoryService.update(+id, updateInventoryDto)
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      const data: any = await this.inventoryService.remove(+id)
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }
}
