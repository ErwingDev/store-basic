import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsString, ValidateNested } from "class-validator"
import { OrderItemsDto } from "./order-items.dto";
import { OrderStatus } from "../enums/order.enum";
import { Message } from "../decorators/message.decorator";

export class OrderDto {
    
    @IsInt({ message: Message.INT("$property") })
    idClient: number;
    
    @IsString({ message: Message.STRING("$property") })
    shippingAddress: string;

    @IsArray({ message: Message.ARRAY("$property") })
    @ValidateNested({ each: true })
    @Type( () => OrderItemsDto )
    items: OrderItemsDto[];

}

export class UpdateOrderStatus {
    
    @IsEnum(OrderStatus)
    status: OrderStatus;

}