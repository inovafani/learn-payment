declare module 'midtrans-client' {
  // ============ Snap API ============
  interface SnapTransaction {
    token: string;
    redirect_url: string;
  }

  interface SnapParameter {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    item_details?: {
      id?: string;
      price: number;
      quantity: number;
      name: string;
    }[];
    [key: string]: any;
  }

  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(parameter: SnapParameter): Promise<SnapTransaction>;
    createTransactionToken(
      parameter: SnapParameter
    ): Promise<{ token: string }>;
    createTransactionRedirectUrl(
      parameter: SnapParameter
    ): Promise<{ redirect_url: string }>;
  }

  // ============ Core API ============
  interface ChargeRequest {
    payment_type: string;
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    [key: string]: any;
  }

  interface TransactionStatus {
    status_code: string;
    transaction_id: string;
    order_id: string;
    transaction_status: string;
    [key: string]: any;
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    charge(parameter: ChargeRequest): Promise<any>;
    capture(parameter: { transaction_id: string }): Promise<any>;

    transaction: {
      status(orderId: string): Promise<TransactionStatus>;
      cancel(orderId: string): Promise<any>;
      approve(orderId: string): Promise<any>;
      deny(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
      refund(parameter: {
        order_id: string;
        amount: number;
        reason?: string;
      }): Promise<any>;
      notification(notification: any): Promise<TransactionStatus>;
    };
  }
}
