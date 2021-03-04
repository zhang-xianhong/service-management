import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { REG_UPPER_CAMEL_CASE } from '../utils/rules';
import { is } from '../utils/validator';

@ValidatorConstraint({ name: 'upperCamel', async: false })
export class UpperCamel implements ValidatorConstraintInterface {
  validate(text: string) {
    return is(text, REG_UPPER_CAMEL_CASE);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} 必须是大驼峰格式`;
  }
}
