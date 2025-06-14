#!/bin/bash

# Default host
HOST="localhost:8080"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--host)
            HOST="$2"
            shift 2
            ;;
        -h=*|--host=*)
            HOST="${1#*=}"
            shift
            ;;
        *)
            if [ -z "$SPARK_ADDRESS" ]; then
                SPARK_ADDRESS="$1"
            elif [ -z "$AMOUNT" ]; then
                AMOUNT="$1"
            else
                echo "Error: Unexpected argument: $1"
                echo "Usage: $0 [-h|--host HOST] <spark-address> <amount-in-millisats>"
                exit 1
            fi
            shift
            ;;
    esac
done

# Check if required arguments are provided
if [ -z "$SPARK_ADDRESS" ] || [ -z "$AMOUNT" ]; then
    echo "Usage: $0 [-h|--host HOST] <spark-address> <amount-in-millisats>"
    echo "Example: $0 --host localhost:8080 sprt1pgss8hjca7z32zkc795d2umcfneknxs7qruvn30ka3d3arzpqfva9vweqx0uhm 1000"
    exit 1
fi

# Validate amount is a number
if ! [[ "$AMOUNT" =~ ^[0-9]+$ ]]; then
    echo "Error: Amount must be a number"
    exit 1
fi

# Determine protocol based on host
if [[ "$HOST" == "localhost"* ]]; then
    PROTOCOL="http"
else
    PROTOCOL="https"
fi

# Get the callback URL
CALLBACK_URL=$(curl -s -X GET "${PROTOCOL}://${HOST}/.well-known/lnurlp/${SPARK_ADDRESS}" | jq -r '.callback')

# Check if we got a valid callback URL
if [ -z "$CALLBACK_URL" ]; then
    echo "Error: Could not get callback URL. Is the server running at ${PROTOCOL}://${HOST}?"
    exit 1
fi

# Get and process the invoice
curl -s -X GET "${CALLBACK_URL}?amount=${AMOUNT}" | jq -r '.pr' | tee /dev/tty | pbcopy 