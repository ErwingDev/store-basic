import { IsInt, IsNumber } from "class-validator"
import { Message } from '../decorators/message.decorator';

export class OrderItemsDto {
    
    @IsInt({ message: Message.INT("$property") })
    idOrder: number;
    
    @IsInt({ message: Message.INT("$property") })
    idProduct: number;
    
    @IsInt({ message: Message.INT("$property") })
    quantity: number;
    
    @IsNumber({}, { message: Message.NUMBER("$property") })
    unitPrice: number;
    
}