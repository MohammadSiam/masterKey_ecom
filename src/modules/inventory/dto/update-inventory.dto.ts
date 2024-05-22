import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
    readonly intProductId: number;
    readonly intQuantity: number;
    readonly dteUpdatedAt: Date;
}
