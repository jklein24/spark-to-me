import { useState } from 'react';
import { LNURLResponse } from './types';
import { CommandLine } from './components/CommandLine';
import { InvoiceForm } from './components/InvoiceForm';
import { HowItWorks } from './components/HowItWorks';
import { Header } from './components/Header';

function App() {
  const [sparkAddress, setSparkAddress] = useState('sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm');
  const [amount, setAmount] = useState('10');
  const [lnurlResponse, setLnurlResponse] = useState<LNURLResponse | null>(null);
  const [callbackResponse, setCallbackResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [callbackLoading, setCallbackLoading] = useState(false);
  const [showResponses, setShowResponses] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLnurlResponse(null);
    setCallbackResponse(null);
    setLoading(true);
    setCallbackLoading(true);
    setShowResponses(true);

    try {
      // First request: Get LNURL response
      const lnurlUrl = `/.well-known/lnurlp/${sparkAddress}`;
      const lnurlRes = await fetch(lnurlUrl);
      if (!lnurlRes.ok) {
        throw new Error(`LNURL request failed: ${lnurlRes.statusText}`);
      }
      const lnurlData = await lnurlRes.json();
      setLnurlResponse(lnurlData);
      setLoading(false);

      // Second request: Use callback URL
      // The callback URL is already a full URL from the server
      const callbackUrl = new URL(lnurlData.callback);
      callbackUrl.searchParams.set('amount', (Number(amount) * 1000).toString());
      
      // Make the request to the callback URL
      const callbackRes = await fetch(callbackUrl.toString(), {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!callbackRes.ok) {
        throw new Error(`Callback request failed: ${callbackRes.statusText}`);
      }
      const callbackData = await callbackRes.json();
      setCallbackResponse(callbackData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error details:', err);
    } finally {
      setCallbackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Header />
          <h1 className="text-4xl font-bold mb-8 text-center">
            sparkto.me
          </h1>
          <p className="text-xl mb-6 text-center text-gray-300">
            Send to any Spark address as a Lightning address!<br/>
          </p>

          <div className="space-y-8">
            <HowItWorks />
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Try it!</h2>
              <InvoiceForm
                sparkAddress={sparkAddress}
                amount={amount}
                loading={loading}
                callbackLoading={callbackLoading}
                onSparkAddressChange={setSparkAddress}
                onAmountChange={setAmount}
                onSubmit={handleSubmit}
              />

              {error && (
                <div className="mb-8 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              {showResponses && (
                <CommandLine
                  loading={loading}
                  callbackLoading={callbackLoading}
                  lnurlResponse={lnurlResponse}
                  callbackResponse={callbackResponse}
                  sparkAddress={sparkAddress}
                  amount={amount}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 