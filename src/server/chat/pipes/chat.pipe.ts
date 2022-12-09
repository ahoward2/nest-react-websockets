import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    const { error } = this.schema.parse(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
