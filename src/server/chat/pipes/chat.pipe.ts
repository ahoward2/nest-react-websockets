import { PipeTransform, Injectable } from '@nestjs/common';
import { Schema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: Schema) {}

  transform(value: any) {
    this.schema.parse(value);
    return value;
  }
}
