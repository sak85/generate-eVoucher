import { generateVouchers } from './generate';

async function test() {
  try {
    console.log('Testing voucher generation...');
    const vouchers = await generateVouchers('USD', 1, 10);
    console.log('Test successful! Vouchers:', vouchers);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

test();