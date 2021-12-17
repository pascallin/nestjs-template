import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const validObjectId = isValidObjectId(value);

    if (!validObjectId) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return value;
  }
}
