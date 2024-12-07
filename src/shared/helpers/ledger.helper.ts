import { Principal } from "@dfinity/principal";

export class LedgerHelpers {
  /**
   * Convert ICP to e8s (smallest ICP unit)
   * @param icp Amount in ICP
   * @returns Amount in e8s
   */
  static icpToE8s(icp: number): bigint {
    return BigInt(Math.round(icp * 100000000));
  }

  /**
   * Convert e8s to ICP
   * @param e8s Amount in e8s
   * @returns Amount in ICP
   */
  static e8sToIcp(e8s: bigint): number {
    return Number(e8s) / 100000000;
  }

  /**
   * Validate Principal
   * @param principal Principal to validate
   * @returns Boolean indicating validity
   */
  static isValidPrincipal(principal: string): boolean {
    try {
      Principal.fromText(principal);
      return true;
    } catch (error) {
      return false;
    }
  }
}
