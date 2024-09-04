export function numberToRoman(num: number): string {
    const numberArr = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const RomanArr = [
      "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"
    ];
    let result = '';
  
    for (let i = 0; i < numberArr.length; i++) {
      while (num >= numberArr[i]) {
        result += RomanArr[i];
        num -= numberArr[i];
      }
    }
  
    return result;
  }
  