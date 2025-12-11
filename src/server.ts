import express from 'express';
import path from 'path';
import { generateVouchers } from './generate';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/generate', async (req, res) => {
  try {
    const { currency, count, amount }: { currency: string; count: number; amount: number } = req.body;
    if (!currency || !count || !amount || count < 1 || count > 100 || amount <= 0) {
      return res.status(400).json({ error: 'Invalid input' });
    }
    const vouchers = await generateVouchers(currency, count, amount);
    res.json(vouchers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});