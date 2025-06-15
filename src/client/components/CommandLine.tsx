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
        <pre className="p-4 bg-gray-800 rounded-lg overflow-x-auto h-[600px] font-mono text-sm">
          <div className="text-gray-400">$ curl -X GET "{protocol}://{host}/.well-known/lnurlp/{sparkAddress}"</div>
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
          ) : (
            <div className="text-gray-500 h-32 flex items-center justify-center">
              Waiting for LNURL response...
            </div>
          )}
        </pre>
      </div>
      {callbackResponse?.pr && (
        <QRCode paymentRequest={callbackResponse.pr} />
      )}
    </div>
  );
} 