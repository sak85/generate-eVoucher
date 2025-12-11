import { GraphQLClient, gql } from 'graphql-request';
import { createObjectCsvWriter } from 'csv-writer';

const endpoint = 'https://payment-gateway.stg.eurostar.com/graphql';

const client = new GraphQLClient(endpoint);

function getMutationTemplate(currency: string, amount: number) {
  return `
    mutation {
      createVoucher (
        amount: ${amount}
        currency: "${currency}"
        type: LDV
        validUntil: "2028-11-01T00:59:59"
      ){
        voucherCode: reference
        internalReference: alias
        currency
        amount
      }
    }
  `;
}

interface Voucher {
  voucherCode: string;
  internalReference: string;
  currency: string;
  amount: number;
}

export async function generateVouchers(currency: string, count: number, amount: number): Promise<Voucher[]> {
  const vouchers: Voucher[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const data = await client.request(getMutationTemplate(currency, amount));
      vouchers.push(data.createVoucher);
    } catch (error) {
      console.error(`Error creating voucher ${i + 1}:`, error);
      throw error;
    }
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `vouchers_${currency}_${timestamp}.csv`;

  const csvWriter = createObjectCsvWriter({
    path: filename,
    header: [
      { id: 'voucherCode', title: 'Voucher Code' },
      { id: 'internalReference', title: 'Internal Reference' },
      { id: 'currency', title: 'Currency' },
      { id: 'amount', title: 'Amount' }
    ]
  });

  await csvWriter.writeRecords(vouchers);

  return vouchers;
}