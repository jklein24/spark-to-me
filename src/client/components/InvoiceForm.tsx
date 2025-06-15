import { useState } from 'react';

interface InvoiceFormProps {
  onSubmit: (address: string, amount: string) => Promise<void>;
}

export function InvoiceForm({ onSubmit }: InvoiceFormProps) {
  const [sparkAddress, setSparkAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(sparkAddress, amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="sparkAddress" className="block text-sm font-medium text-gray-300 mb-2">
          Spark Address
        </label>
        <input
          type="text"
          id="sparkAddress"
          value={sparkAddress}
          onChange={(e) => setSparkAddress(e.target.value)}
          placeholder="sp1..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Amount (sats)
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount in sats"
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors duration-200"
      >
        Fetch Invoice
      </button>
    </form>
  );
} 