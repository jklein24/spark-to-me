import { LNURLResponse } from '../types';
import { QRCode } from './QRCode';

interface CommandLineProps {
  loading: boolean;
  callbackLoading: boolean;
  lnurlResponse: LNURLResponse | null;
  callbackResponse: any;
  sparkAddress: string;
  amount: string;
}

export function CommandLine({
  loading,
  callbackLoading,
  lnurlResponse,
  callbackResponse,
  sparkAddress,
  amount,
}: CommandLineProps) {
  const protocol = window.location.protocol;
  const host = window.location.host;
  
  return (
    <div className="mb-8">
      <div className="relative">
        {!lnurlResponse && !loading && (
          <div className="text-gray-400 h-16 flex flex-col items-center justify-center text-center px-4 mb-4">
            <p>Enter a Spark address and amount to get an invoice</p>
          </div>
        )}
        <pre className="p-3 sm:p-4 bg-gray-800 rounded-lg overflow-x-auto h-[400px] sm:h-[600px] font-mono text-xs sm:text-sm whitespace-pre-wrap break-all">
          <div className="text-gray-400">$ curl -X GET "{protocol}://{host}/.well-known/lnurlp/{sparkAddress || 'your_spark_address'}"</div>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : lnurlResponse ? (
            <>
              <div className="text-green-400 mt-2">Response:</div>
              <div className="text-gray-300 mt-1">{JSON.stringify(lnurlResponse, null, 2)}</div>
              <div className="text-gray-400 mt-4">$ curl -X GET "{lnurlResponse.callback}?amount={(Number(amount) * 1000).toString()}" -H "Accept: application/json"</div>
              {callbackLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : callbackResponse ? (
                <>
                  <div className="text-green-400 mt-2">Response:</div>
                  <div className="text-gray-300 mt-1">{JSON.stringify(callbackResponse, null, 2)}</div>
                </>
              ) : (
                <div className="text-gray-500 h-32 flex items-center justify-center">
                  Waiting for callback response...
                </div>
              )}
            </>
          ) : null}
        </pre>
      </div>
      {callbackResponse?.pr && (
        <QRCode paymentRequest={callbackResponse.pr} />
      )}
    </div>
  );
} 