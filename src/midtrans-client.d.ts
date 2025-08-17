declare module 'midtrans-client' {
  export class Snap {
    constructor(options: { isProduction?: boolean; serverKey: string });
    createTransaction(
      parameter: any
    ): Promise<{ token: string; redirect_url: string }>;
    transaction: {
      notification(notification: any): Promise<any>;
    };
  }
}
