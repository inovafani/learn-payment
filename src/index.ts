import express, { type Request, type Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from Express with Typescript!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
