export default class UmaConfig {
  constructor(
    public readonly umaEncryptionCertChain: string,
    public readonly umaEncryptionPubKeyHex: string,
    public readonly umaEncryptionPrivKeyHex: string,
    public readonly umaSigningCertChain: string,
    public readonly umaSigningPubKeyHex: string,
    public readonly umaSigningPrivKeyHex: string,
    public readonly sendingVaspDomain: string | undefined,
  ) {}

  static fromEnvironment(): UmaConfig {
    return new UmaConfig(
      requireEnv("UMA_ENCRYPTION_CERT_CHAIN").replaceAll(/\\n/g, "\n"),
      requireEnv("UMA_ENCRYPTION_PUBKEY"),
      requireEnv("UMA_ENCRYPTION_PRIVKEY"),
      requireEnv("UMA_SIGNING_CERT_CHAIN").replaceAll(/\\n/g, "\n"),
      requireEnv("UMA_SIGNING_PUBKEY"),
      requireEnv("UMA_SIGNING_PRIVKEY"),
      process.env.UMA_VASP_DOMAIN,
    );
  }

  umaEncryptionPubKey(): Uint8Array {
    const buffer = Buffer.from(this.umaEncryptionPubKeyHex, "hex");
    return new Uint8Array(buffer);
  }

  umaEncryptionPrivKey(): Uint8Array {
    const buffer = Buffer.from(this.umaEncryptionPrivKeyHex, "hex");
    return new Uint8Array(buffer);
  }

  umaSigningPubKey(): Uint8Array {
    const buffer = Buffer.from(this.umaSigningPubKeyHex, "hex");
    return new Uint8Array(buffer);
  }

  umaSigningPrivKey(): Uint8Array {
    const buffer = Buffer.from(this.umaSigningPrivKeyHex, "hex");
    return new Uint8Array(buffer);
  }
}

export const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set.`);
  }
  return value;
};
