import {
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../../db/data-access/prisma.service';
import { Injectable } from '@nestjs/common';

interface UniqueValidationArguments extends ValidationArguments {
  constraints: string[];
}

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(private readonly prismaService: PrismaService) {}

  async validate(value: string, args: UniqueValidationArguments) {
    const [entityName, field = args.property] = args.constraints;
    return (
      (await this.prismaService[entityName].count({
        where: {
          [field || args.property]: value,
        },
      })) <= 0
    );
  }

  public defaultMessage(args: ValidationArguments) {
    const [entityName] = args.constraints;
    return `${entityName} with the same ${args.property} already exists`;
  }
}

export function Unique(constraints: [string, string]) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: null,
      constraints: constraints,
      validator: UniqueValidator,
    });
  };
}
