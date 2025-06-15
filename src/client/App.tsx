import { useState } from 'react';
import { LNURLResponse } from './types';
import { CommandLine } from './components/CommandLine';
import { InvoiceForm } from './components/InvoiceForm';
import { HowItWorks } from './components/HowItWorks';
import { Header } from './components/Header';

function App() {
  const [loading, setLoading] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [lnurlResponse, setLnurlResponse] = useState<LNURLResponse | null>(null);
  const [callbackResponse, setCallbackResponse] = useState<any>(null);
  const [sparkAddress, setSparkAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (address: string, amount: string) => {
    setSparkAddress(address);
    setAmount(amount);
    setLoading(true);
    setLnurlResponse(null);
    setCallbackResponse(null);

    try {
      const response = await fetch(`/.well-known/lnurlp/${address}`);
      const data = await response.json();
      setLnurlResponse(data);

      if (data.callback) {
        setCallbackLoading(true);
        const callbackResponse = await fetch(
          `${data.callback}?amount=${(Number(amount) * 1000).toString()}`,
          {
            headers: {
              Accept: 'application/json',
            },
          }
        );
        const callbackData = await callbackResponse.json();
        setCallbackResponse(callbackData);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
      setCallbackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <Header />
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              sparkto.me
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 px-4">
              Receive Lightning payments to your Spark address
            </p>
          </div>
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6 sm:space-y-8">
              <HowItWorks />
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
                <InvoiceForm onSubmit={handleSubmit} />
              </div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50">
              <CommandLine
                loading={loading}
                callbackLoading={callbackLoading}
                lnurlResponse={lnurlResponse}
                callbackResponse={callbackResponse}
                sparkAddress={sparkAddress}
                amount={amount}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 