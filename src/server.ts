import express from 'express';
import path from 'path';
import { generateVouchers } from './generate';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the public folder
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Ensure public directory exists
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}

app.post('/generate', async (req, res) => {
  try {
    const { currency, count, amount }: { currency: string; count: number; amount: number } = req.body;

    if (!currency || !count || !amount || count < 1 || count > 100 || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Generate vouchers
    const vouchers = await generateVouchers(currency, count, amount);

    // Generate CSV file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `vouchers_${currency}_${timestamp}.csv`;
    const filePath = path.join(publicPath, filename);

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'voucherCode', title: 'Voucher Code' },
        { id: 'internalReference', title: 'Internal Reference' },
        { id: 'currency', title: 'Currency' },
        { id: 'amount', title: 'Amount' }
      ]
    });

    await csvWriter.writeRecords(vouchers);

    // Return vouchers array
    res.json(vouchers);

  } catch (error) {
    console.error('Server error:', error);

    // Handle the error properly since TypeScript doesn't know its type
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage += ': ' + error.message;
    }

    res.status(500).json({ error: errorMessage });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});