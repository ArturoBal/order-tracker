import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MaxLength,
  MinLength,
  Max,
} from 'class-validator';
import { OrderStatus } from '../enums/orders-status.enum';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(40)
  customerName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  item: string;

  @IsNumber()
  @Min(1)
  @Max(1000)
  quantity: number;

  @IsNumber()
  @IsPositive()
  @Max(100000)
  price: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
