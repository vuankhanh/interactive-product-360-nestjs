import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CustomBadRequestException } from '../exception/custom-exception';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if(!value){
      return value;
    }
    if (!ObjectId.isValid(value)) {
      throw new CustomBadRequestException(`${value} không đúng là MongoDB ID`);
    }
    return ObjectId.createFromHexString(value); 
  }
}

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  constructor(private readonly propertyTransform: string) { }
  transform(value: any, metadata: ArgumentMetadata) {
    if(!value){
      return value;
    }
    value[this.propertyTransform] = value[this.propertyTransform].map((id: string) => ObjectId.createFromHexString(id))
    return value;
  }
}
