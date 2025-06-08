import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class QueryArrayPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value?.equal && !Array.isArray(value.equal)) {
            value.equal = [value.equal];
        }
        return value;
    }
}