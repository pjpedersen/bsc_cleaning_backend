interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
}

interface InvoiceCalculation {
  subtotal: number;
  vatAmount: number;
  total: number;
  items: InvoiceItem[];
}

export const calculateItemTotal = (item: InvoiceItem): number => {
  return item.quantity * item.unitPrice;
};

export const calculateItemVAT = (item: InvoiceItem): number => {
  return calculateItemTotal(item) * (item.vatRate / 100);
};

export const calculateInvoice = (items: InvoiceItem[]): InvoiceCalculation => {
  const subtotal = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
  const vatAmount = items.reduce((sum, item) => sum + calculateItemVAT(item), 0);
  const total = subtotal + vatAmount;

  return {
    subtotal,
    vatAmount,
    total,
    items
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('da-DK', {
    style: 'currency',
    currency: 'DKK'
  }).format(amount);
};

export const generateInvoiceNumber = (prefix: string, sequence: number): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const sequenceStr = String(sequence).padStart(4, '0');
  return `${prefix}-${year}${month}-${sequenceStr}`;
}; 