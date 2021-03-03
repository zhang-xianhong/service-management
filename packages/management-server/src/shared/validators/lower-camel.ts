import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { REG_LOWER_CAMEL_CASE } from '../utils/rules';
import { is } from '../utils/validator';

@ValidatorConstraint({ name: 'lowerCamel', async: false })
export class LowerCamel implements ValidatorConstraintInterface {
  validate(text: string) {
    return is(text, REG_LOWER_CAMEL_CASE);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} 必须是小驼峰格式`;
  }
}
