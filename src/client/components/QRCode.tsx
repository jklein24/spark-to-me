import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  paymentRequest: string;
}

export function QRCode({ paymentRequest }: QRCodeProps) {
  return (
    <div className="mt-8 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Scan to Pay</h3>
      <div className="flex justify-center">
        <QRCodeSVG
          value={paymentRequest}
          size={256}
          level="M"
          includeMargin={true}
          className="bg-white p-2 rounded-lg"
        />
      </div>
      <div className="mt-4 text-sm text-gray-400 break-all">
        {paymentRequest}
      </div>
    </div>
  );
} 