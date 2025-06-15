interface InvoiceFormProps {
  sparkAddress: string;
  amount: string;
  loading: boolean;
  callbackLoading: boolean;
  onSparkAddressChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InvoiceForm({
  sparkAddress,
  amount,
  loading,
  callbackLoading,
  onSparkAddressChange,
  onAmountChange,
  onSubmit,
}: InvoiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="sparkAddress" className="block text-sm font-medium text-gray-300 mb-1">
            Spark Address
          </label>
          <input
            id="sparkAddress"
            type="text"
            value={sparkAddress}
            onChange={(e) => onSparkAddressChange(e.target.value)}
            placeholder="Enter your Spark address"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
            Amount (sats)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter amount in sats"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || callbackLoading}
          className="w-full px-6 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading || callbackLoading ? 'Loading...' : 'Get Invoice'}
        </button>
      </div>
    </form>
  );
} 