const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function uuidToBase58(uuid: string): string {
  const hex = uuid.replace(/-/g, '');
  const num = BigInt('0x' + hex);
  
  let result = '';
  let n = num;
  while (n > 0n) {
    const remainder = Number(n % 58n);
    result = BASE58[remainder] + result;
    n = n / 58n;
  }
  return result;
}

function base58ToUuid(short: string): string {
  let num = 0n;
  for (let i = 0; i < short.length; i++) {
    num = num * 58n + BigInt(BASE58.indexOf(short[i]));
  }
  
  let hex = num.toString(16).padStart(32, '0');
  
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}


export { uuidToBase58, base58ToUuid };