import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'customIdentityCard', async: false })
export class CustomIdentityCard implements ValidatorConstraintInterface {
  validate(str: string) {
    const provincesAndCities = [
      '11', // 北京
      '12', // 天津
      '13', // 河北
      '14', // 山西
      '15', // 内蒙古
      '21', // 辽宁
      '22', // 吉林
      '23', // 黑龙江
      '31', // 上海
      '32', // 江苏
      '33', // 浙江
      '34', // 安徽
      '35', // 福建
      '36', // 江西
      '37', // 山东
      '41', // 河南
      '42', // 湖北
      '43', // 湖南
      '44', // 广东
      '45', // 广西
      '46', // 海南
      '50', // 重庆
      '51', // 四川
      '52', // 贵州
      '53', // 云南
      '54', // 西藏
      '61', // 陕西
      '62', // 甘肃
      '63', // 青海
      '64', // 宁夏
      '65', // 新疆
      '71', // 台湾
      '81', // 香港
      '82', // 澳门
      '91', // 国外
    ];
    const powers = ['7', '9', '10', '5', '8', '4', '2', '1', '6', '3', '7', '9', '10', '5', '8', '4', '2'];
    const parityBit = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    const checkAddressCode = function checkAddressCode(addressCode) {
      return provincesAndCities.includes(addressCode);
    };

    const checkBirthDayCode = function checkBirthDayCode(birDayCode) {
      const yyyy = parseInt(birDayCode.substring(0, 4), 10);
      const mm = parseInt(birDayCode.substring(4, 6), 10);
      const dd = parseInt(birDayCode.substring(6), 10);
      const xdata = new Date(yyyy, mm - 1, dd);

      if (xdata > new Date()) {
        return false; // eslint-disable-next-line max-len
      } if (xdata.getFullYear() === yyyy && xdata.getMonth() === mm - 1 && xdata.getDate() === dd) {
        return true;
      }

      return false;
    };

    const getParityBit = function getParityBit(idCardNo) {
      const id17 = idCardNo.substring(0, 17);
      let power = 0;

      for (let i = 0; i < 17; i++) {
        power += parseInt(id17.charAt(i), 10) * parseInt(powers[i], 10);
      }

      const mod = power % 11;
      return parityBit[mod];
    };

    const checkParityBit = function checkParityBit(idCardNo) {
      return getParityBit(idCardNo) === idCardNo.charAt(17).toUpperCase();
    };

    const check15IdCardNo = function check15IdCardNo(idCardNo) {
      let check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
      if (!check) return false;
      const addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      const birDayCode = '19'.concat(idCardNo.substring(6, 12));
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return true;
    };

    const check18IdCardNo = function check18IdCardNo(idCardNo) {
      let check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
      if (!check) return false;
      const addressCode = idCardNo.substring(0, 2);
      check = checkAddressCode(addressCode);
      if (!check) return false;
      const birDayCode = idCardNo.substring(6, 14);
      check = checkBirthDayCode(birDayCode);
      if (!check) return false;
      return checkParityBit(idCardNo);
    };

    const checkIdCardNo = function checkIdCardNo(idCardNo) {
      const check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
      if (!check) return false;

      if (idCardNo.length === 15) {
        return check15IdCardNo(idCardNo);
      }

      return check18IdCardNo(idCardNo);
    };

    return checkIdCardNo(str);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} 身份证号不合法`;
  }
}
