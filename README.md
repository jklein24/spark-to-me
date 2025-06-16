# Sparkto.me

An UMA/lnurl-pay server that can route payments to any Spark address. See [sparkto.me](https://sparkto.me) for the live site.

## Running the server

Configure environment variables needed for UMA messages (keys, etc.). Information on how to set them can be found in `src/UmaConfig.ts`.

Create a secp256k1 private key to use as your encryption private key (`UMA_ENCRYPTION_PRIVKEY`) and use this private key to wrap the corresponding encryption public key in an X.509 Certificate (`UMA_ENCRYPTION_CERT_CHAIN`). Similarly for signing, create a secp256k1 private key to use as your signing private key (`UMA_SIGNING_PRIVKEY`) and use this private key to wrap the corresponding signing public key in an X.509 Certificate (`UMA_SIGNING_CERT_CHAIN`). You may choose to use the same keypair for encryption and signing. For information on generating these, see [our docs](https://docs.uma.me/uma-standard/keys-authentication-encryption).

To run locally on your machine, from the `root` directory, run:

```bash
yarn dev
```

This will run the server on port 8080 and the client on port 3000. To set all of the config variables at once, you can do something like:

```bash
UMA_ENCRYPTION_CERT_CHAIN=<pem-encoded x509 certificate chain containing encryption pubkey> \
UMA_ENCRYPTION_PUBKEY=<encryption public key hex> \
UMA_ENCRYPTION_PRIVKEY=<encryption private key hex> \
UMA_SIGNING_CERT_CHAIN=<pem-encoded x509 certificate chain containing signing pubkey> \
UMA_SIGNING_PUBKEY=<signing public key hex> \
UMA_SIGNING_PRIVKEY=<signing private key hex> \
yarn dev
```

## Running with Docker

You can also run this server with Docker. First we need to build the image. From the root `js` directory, run:

```bash
docker build -t spark-to-me .
```

Next, we need to set up the config variables. You can do this by creating a file called `local.env` in the root directory. This file should contain the following:

```bash
UMA_ENCRYPTION_CERT_CHAIN=<pem-encoded x509 certificate chain containing encryption pubkey>
UMA_ENCRYPTION_PUBKEY=<hex-encoded encryption pubkey>
UMA_ENCRYPTION_PRIVKEY=<hex-encoded encryption privkey>
UMA_SIGNING_CERT_CHAIN=<pem-encoded x509 certificate chain containing signing pubkey>
UMA_SIGNING_PUBKEY=<hex-encoded signing pubkey>
UMA_SIGNING_PRIVKEY=<hex-encoded signing privkey>

# Optional: A custom VASP domain in case you're hosting this at a fixed hostname.
UMA_VASP_DOMAIN=<your custom VASP domain. ex: vasp1.example.com>
```

Then, run the image:

```bash
docker run -it --env-file local.env -p 8080:8080 spark-to-me
```

## Running Test Queries

You can easily simulate an lnurl-pay flow by using the `curl`:

```bash
curl -s -X GET http://localhost:8080/.well-known/lnurlp/sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm | jq
```

This will return something like:

```json
{
  "callback": "http://localhost:8080/api/lnurl/payreq/sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm",
  "maxSendable": 10000000,
  "minSendable": 1000,
  "metadata": "[[\"text/plain\",\"Pay sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm@localhost\"],[\"text/identifier\",\"sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm@localhost\"]]",
  "tag": "payRequest"
}
```

You can then use the `callback` URL to fetch the payment request. Remember to attach an amount param in millisats:

```bash
curl -s -X GET http://localhost:8080/api/lnurl/payreq/sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm?amount=1000 | jq
```

This will return something like:

```json
{
  "pr": "lnbcrt10n1p5y69k6pp550xc4dp4lw2ycngrx3p6kxgyl8vez6pztsqn6gvqchqaezfdwv0qsp5gz0s09hz9hfxuk470lr06vlmv30q062p2gwrh6z84nr9jeh422gqxqrrssnp4qtlyk6hxw5h4hrdfdkd4nh2rv0mwyyqvdtakr3dv6m4vvsmfshvg6rzjqgp0s738klwqef7yr8yu54vv3wfuk4psv46x5laf6l6v5x4lwwahvqqqqrusum7gtyqqqqqqqqqqqqqq9qcqzpghp5j7jtvd5x8z9xznnmmd7afwn32ydd3cgp0fnwxkehtzqsux7wxrds9qyyssqymynyp8gf4k8ryc3fmaszwryz0lsuak4xxmatdpyzqt4hv5mvyl9mzfgazfr89zkt7zapjxmnzpw4tjj48ww3x6ypv4ulzj63rcu8qqquxum9c",
  "routes": [],
  "payeeData": {
    "identifier": "$sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm@localhost"
  },
  "converted": {
    "amount": 1,
    "currencyCode": "SAT",
    "decimals": 0,
    "multiplier": 1000,
    "fee": 0
  }
}
```

You can then use the `pr` field to pay the invoice with your spark or lightning wallet!

Here's a fun one-liner to fetch an invoice for 1000 millisats:

```bash
CALLBACK_URL=$(curl -s -X GET http://localhost:8080/.well-known/lnurlp/sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm | jq -r '.callback') && curl -s -X GET "${CALLBACK_URL}?amount=1000" | jq -r '.pr' | tee /dev/tty | pbcopy
```

This will copy the invoice to your clipboard and print it to the terminal. You can then paste it into your spark or lightning wallet to pay it.

### Using the get-invoice.sh Script

For convenience, you can use the included `get-invoice.sh` script to fetch invoices. The script takes a spark address and an amount in millisats as arguments, with an optional host parameter:

```bash
./get-invoice.sh [-h|--host HOST] <spark-address> <amount-in-millisats>
```

For example:

```bash
# Using default host (localhost:8080)
./get-invoice.sh sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm 1000

# Specifying a custom host
./get-invoice.sh --host sparkto.me sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm 1000
```

This will fetch an invoice for 1000 millisats and both print it to the terminal and copy it to your clipboard.

## Navigating the code

The main interesting bit of code for this application is in [ReceivingVasp.ts](https://github.com/jklein24/spark-to-me/blob/main/src/receiving/ReceivingVasp.ts). This is the class that handles incoming lnurl-pay or UMA requests and creates lightning invoices for the right spark wallet.

This code is a modified version of the demo [UMA VASP](https://github.com/lightsparkdev/js-sdk/tree/main/apps/examples/uma-vasp) codebase. Much of the complexity has been removed, but there are still a lot of remnants of UMA functionality to allow for expansion of this server in the future. For example, to allow for multi-currency support, and an UMA sender implementation in [SendingVasp.ts](https://github.com/jklein24/spark-to-me/blob/main/src/sending/SendingVasp.ts).

There is also a simple landing page and client that allows you to fetch invoices for any spark address. This is in [src/client](https://github.com/jklein24/spark-to-me/tree/main/src/client) and can be seen at [sparkto.me](https://sparkto.me).
