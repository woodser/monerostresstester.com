const monerojs = require("monero-javascript");
const BigInteger = monerojs.BigInteger;

const MoneroUtils = monerojs.MoneroUtils;

class XMR_Au_Converter {
  /**
   * Convert XMR to atomic units.
   * 
   * @param {number|string} amountXmr - amount in XMR to convert to atomic units
   * @return {BigInteger} - amount in atomic units
   */
  
  static xmrToAtomicUnits(amountXmr) {
    console.log("********");
    console.log("xmrToAtmoicUnits debug");
    console.log("********");
    console.log("amount submitted to function: " + amountXmr);
    if (typeof amountXmr === "number") amountXmr = "" + amountXmr;
    else if (typeof amountXmr !== "string") throw new MoneroError("Must provide XMR amount as a string or js number to convert to atomic units");
    let decimalDivisor = 1;
    let decimalIdx = amountXmr.indexOf('.');
    
    console.log("decimalIdx: " + decimalIdx);
    
    if (decimalIdx > -1) {
      decimalDivisor = Math.pow(10, amountXmr.length - decimalIdx - 1);
      console.log("decimalDivisor: " + decimalDivisor);
      amountXmr = Number(amountXmr.slice(0, decimalIdx) + amountXmr.slice(decimalIdx + 1)) + "";
    }
    console.log("this.AU_PER_XMR: " + this.AU_PER_XMR);
    console.log("BigInteger(amountXmr) * BigInteger(this.AU_PER_XMR) / BigInteger(decimalDivisor)");
    console.log("     " + new BigInteger(amountXmr) + "        " + new BigInteger(this.AU_PER_XMR) + "        " + new BigInteger(decimalDivisor));
    return new BigInteger(amountXmr).multiply(new BigInteger(this.AU_PER_XMR)).divide(new BigInteger(decimalDivisor));
  }
  
  /**
   * Convert atomic units to XMR.
   * 
   * @param {BigInteger} amountAtomicUnits - amount in atomic units to convert to XMR
   * @return {number} - amount in XMR 
   */
  static atomicUnitsToXmr(amountAtomicUnits) {
    if (!(amountAtomicUnits instanceof BigInteger)) throw new MoneroError("Must provide atomic units as BigInteger to convert to XMR");
    let quotientAndRemainder = amountAtomicUnits.divRem(new BigInteger(this.AU_PER_XMR));
    return Number(quotientAndRemainder[0].toJSValue() + quotientAndRemainder[1].toJSValue() / this.AU_PER_XMR);
  }
  
}

XMR_Au_Converter.AU_PER_XMR = 1000000000000; //Is this accurate?

export default XMR_Au_Converter;