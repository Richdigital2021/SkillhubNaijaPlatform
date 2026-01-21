
declare const PaystackPop: any;
declare const FlutterwaveCheckout: any;

interface PaymentConfig {
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const initializePaystack = (config: PaymentConfig) => {
  const handler = PaystackPop.setup({
    key: 'pk_test_placeholder', // Should be process.env.PAYSTACK_PUBLIC_KEY
    email: config.email,
    amount: config.amount * 100, // Paystack uses Kobo
    ref: config.reference,
    currency: 'NGN',
    callback: (response: any) => {
      config.onSuccess(response.reference);
    },
    onClose: () => {
      config.onClose();
    },
  });
  handler.openIframe();
};

export const initializeFlutterwave = (config: PaymentConfig) => {
  FlutterwaveCheckout({
    public_key: 'FLWPUBK_TEST-placeholder', // Should be process.env.FLW_PUBLIC_KEY
    tx_ref: config.reference,
    amount: config.amount,
    currency: 'NGN',
    payment_options: 'card, banktransfer, ussd',
    customer: {
      email: config.email,
    },
    callback: (data: any) => {
      if (data.status === "successful") {
        config.onSuccess(data.transaction_id || data.tx_ref);
      }
    },
    onclose: () => {
      config.onClose();
    },
  });
};
