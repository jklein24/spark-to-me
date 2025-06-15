export function HowItWorks() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">How it works</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-300">
        <li>Share your Lightning Address: <span className="font-mono text-primary">{'{spark_address}@sparkto.me'}</span></li>
        <li>Anyone can pay you using any Lightning wallet that supports Lightning Addresses</li>
        <li>Funds are delivered to your Spark address</li>
      </ol>
    </section>
  );
} 