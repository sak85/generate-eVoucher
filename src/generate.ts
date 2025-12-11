import { GraphQLClient, gql } from 'graphql-request';

const endpoint = 'https://payment-gateway.stg.eurostar.com/graphql';
const client = new GraphQLClient(endpoint);

function getMutationTemplate(currency: string, amount: number) {
  return `
    mutation {
      createVoucher (
        amount: ${amount}
        currency: ${currency}
        type: LDV
        validUntil: "2028-11-01T00:59:59"
      ){
        voucherCode: reference
        internalReference: alias
        currency
        # amount is NOT included here because API doesn't return it
      }
    }
  `;
}

interface Voucher {
  voucherCode: string;
  internalReference: string;
  currency: string;
  amount: number; // We'll add this manually
}

export async function generateVouchers(currency: string, count: number, amount: number): Promise<Voucher[]> {
  const vouchers: Voucher[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const data = await client.request(getMutationTemplate(currency, amount));
      // Create voucher object with amount added manually
      const voucher = {
        voucherCode: data.createVoucher.voucherCode,
        internalReference: data.createVoucher.internalReference,
        currency: data.createVoucher.currency,
        amount: amount // Add the amount we requested
      };
      vouchers.push(voucher);
    } catch (error) {
      console.error(`Error creating voucher ${i + 1}:`, error);
      throw error;
    }
  }

  return vouchers;
}