import { Currency, LnurlpResponse } from "@uma-sdk/core";
import { PaymentRequestObject } from "bolt11";
import { v4 as uuidv4 } from "uuid";
import SendingVaspRequestCache, {
  SendingVaspInitialRequestData,
  SendingVaspPayReqData,
} from "./SendingVaspRequestCache.js";

/**
 * A simple in-memory cache for data that needs to be remembered between calls to VASP1. In practice, this would be
 * stored in a database or other persistent storage.
 */
export default class InMemorySendingVaspRequestCache
  implements SendingVaspRequestCache
{
  /**
   * This is a map of the UMA request UUID to the LnurlpResponse from that initial Lnurlp request.
   * This is used to cache the LnurlpResponse so that we can use it to generate the UMA payreq without the client
   * having to make another Lnurlp request or remember lots of details.
   * NOTE: In production, this should be stored in a database or other persistent storage.
   */
  private lnurlpRequestCache: Map<string, SendingVaspInitialRequestData> =
    new Map();

  /**
   * This is a map of the UMA request UUID to the payreq data that we generated for that request.
   * This is used to cache the payreq data so that we can pay the invoice when the user confirms
   * NOTE: In production, this should be stored in a database or other persistent storage.
   */
  private payReqCache: Map<string, SendingVaspPayReqData> = new Map();

  public getLnurlpResponseData(
    uuid: string,
  ): SendingVaspInitialRequestData | undefined {
    return this.lnurlpRequestCache.get(uuid);
  }

  public getPayReqData(uuid: string): SendingVaspPayReqData | undefined {
    return this.payReqCache.get(uuid);
  }

  public getPendingPayReqs(): SendingVaspPayReqData[] {
    return [...this.payReqCache.values()];
  }

  public saveLnurlpResponseData(
    lnurlpResponse: LnurlpResponse,
    receiverId: string,
    receivingVaspDomain: string,
  ): string {
    const uuid = uuidv4();
    this.lnurlpRequestCache.set(uuid, {
      lnurlpResponse,
      receiverId,
      receivingVaspDomain,
    });
    return uuid;
  }

  public savePayReqData(
    receiverUmaAddress: string,
    encodedInvoice: string,
    invoiceUUID: string | undefined,
    utxoCallback: string | undefined = undefined,
    invoiceData: PaymentRequestObject | undefined = undefined,
    senderCurrencies: Currency[] | undefined = undefined,
  ): string {
    const uuid = invoiceUUID ?? uuidv4();
    this.payReqCache.set(uuid, {
      receiverUmaAddress,
      encodedInvoice,
      utxoCallback,
      invoiceData,
      senderCurrencies,
    });
    return uuid;
  }

  public removePayReq(uuid: string): void {
    if (this.payReqCache.has(uuid)) {
      this.payReqCache.delete(uuid);
    }
  }
}
