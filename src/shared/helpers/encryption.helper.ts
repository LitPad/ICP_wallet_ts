import Cryptr from "cryptr";

const cryptr = new Cryptr("VerySecretEncryptionKey");

export function encrypt(data: string) {
  return cryptr.encrypt(data);
}

export function decrypt(data: string) {
  return cryptr.decrypt(data);
}
