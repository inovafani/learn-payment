import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import MidtransClient from 'midtrans-client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const snap = new MidtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY as string,
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from Express with Typescript!');
});

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
          prices: 100000,
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
    const transactionToken = transacion.token;

    res.status(200).json({
      token: transactionToken,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

app.post('/notification', async (req: Request, res: Response) => {
  try {
    const notification = req.body;
    const statusResponse = await snap.transaction.notification(notification);
    const { transaction_status: transactionStatus, fraud_status: fraudStatus } =
      statusResponse;

    console.log(
      `Transaction status recieved for orderId: ${statusResponse.order_id}`
    );

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        console.log(`Transaction challenge: ${statusResponse.order_id}`);
      } else if (fraudStatus === 'accept') {
        console.log(`Transaction accept: ${statusResponse.order_id}`);
      }
    } else if (transactionStatus === 'settlement') {
      console.log(`Transaction settlement: ${statusResponse.order_id}`);
    } else if (transactionStatus === 'pending') {
      console.log(`Transaction pending: ${statusResponse.order_id}`);
    } else if (transactionStatus === 'deny') {
      console.log(`Transaction denied: ${statusResponse.order_id}`);
    } else if (transactionStatus === 'expire') {
      console.log(`Transaction expired: ${statusResponse.order_id}`);
    } else if (transactionStatus === 'cancel') {
      console.log(`Transaction cancelled: ${statusResponse.order_id}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Error processing notification:', error);
    res.status(200).send('OK');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
