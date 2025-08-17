import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import MidtransClient from 'midtrans-client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const serverKey = process.env.MIDTRANS_SERVER_KEY;
if (!serverKey) {
  console.error('Error: MIDTRANS_SERVER_KEY is not defined in your .env file.');
  process.exit(1); // Exit the application with an error code
}

const clientKey = process.env.MIDTRANS_CLIENT_KEY;
if (!clientKey) {
  console.error('Error: MIDTRANS_CLIENT_KEY is not defined in your .env file.');
  process.exit(1); // Exit the application with an error code
}

app.use(express.json());

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: serverKey,
  clientKey: clientKey,
});

// CoreApi untuk cek status
const coreApi = new MidtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
  clientKey: process.env.MIDTRANS_CLIENT_KEY as string,
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from Express with Typescript!');
});

// ✅ CREATE TRANSACTION
app.post('/create-transaction', async (req: Request, res: Response) => {
  try {
    const orderId = `ORDER-${Date.now()}`;

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: 100000,
      },
      item_details: [
        {
          id: 'ITEM-1',
          name: 'Product Name',
          price: 100000,
          quantity: 1,
        },
      ],
      customer_details: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        phone: '081234567890',
      },
    };

    const transaction = await snap.createTransaction(parameter);

    res.status(200).json({
      orderId,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// ✅ NOTIFICATION
app.post('/notification', async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    const statusResponse = await coreApi.transaction.notification(notification);
    console.log(`Transaction status received:`, statusResponse);

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(200).send('OK');
  }
});

// ✅ CHECK STATUS
app.get('/check-transaction/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const status = await coreApi.transaction.status(orderId as string);
    res.status(200).json(status);
  } catch (error) {
    console.error('Error fetching transaction status:', error);
    res.status(500).json({ error: 'Failed to fetch transaction status' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
