// https://github.com/tahowallet/extension/blob/main/window-provider/index.ts
// keep isMetaMask and remove isRabby
const impersonateMetamaskWhitelist = [
  "traderjoexyz.com",
  "transferto.xyz",
  "opensea.io",
  "polygon.technology",
  // "gmx.io",
  "app.lyra.finance",
  "matcha.xyz",
  "bridge.umbria.network",
  // "galaxy.eco",
  // "galxe.com",
  "dydx.exchange",
  "app.euler.finance",
  "kwenta.io",
  "stargate.finance",
  // "etherscan.io",
  "swapr.eth.link",
  "apex.exchange",
  "app.yieldprotocol.com",
  // "tofunft.com",
  // "aboard.exchange",
  "portal.zksync.io",
  // "blur.io",
  // "app.benqi.fi",
  // "snowtrace.io",
  // "core.app",
  // "cbridge.celer.network",
  "app.multchain.cn",
  // "app.venus.io",
  // "app.alpacafinance.org",
  "pancakeswap.finance",
  "liquidifty.io",
  "ankr.com",
  "mint.xencrypto.io",
  // "bscscan.com",
  "alchemy.com",
  "cow.fi",
  "tally.xyz",
  "kyberswap.com",
  "space.id",

  "bitcoinbridge.network",
  "bridge.liquidswap.com",
  "theaptosbridge.com",
  "app.actafi.org",
  "goal3.xyz",
];

// keep isRabby and remove isMetaMask
const rabbyHostList = [
  "enso.finance",
  "telx.network",
  "link3.to",
  "hypercerts.org",
];

/**
 * Detect current host is includes target host
 * @param current
 * @param target
 * @returns
 */
const isIncludesHost = (current: string, target: string) => {
  return current === target || current.endsWith(`.${target}`);
};

const isInHostList = (list: string[], host: string) => {
  return list.some((target) => isIncludesHost(host, target));
};

// generates a hash value for a sting
// same as djb2 hash function
const djb2 = (str: string) => {
  let hash = 5381;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
};

const rootDomainList = [
  "eth.limo",
  "eth.link",
  "github.com",
  "github.io",
  "ipfs.io",
  "linktr.ee",
  "surge.sh",
  "vercel.com",
];

const getRootDomain = (host: string) => {
  return host.split(".").slice(-2).join(".");
};

const calcIsGray = (host: string, ratio: number) => {
  let domain = getRootDomain(host);
  if (isInHostList(rootDomainList, host)) {
    domain = host;
  }
  return (djb2(domain) % 100) / 100 <= ratio;
};

type Mode = "metamask" | "rabby" | "default";

export const getProviderMode = (host: string): Mode => {
  if (isInHostList(impersonateMetamaskWhitelist, host)) {
    return "metamask";
  }
  if (isInHostList(rabbyHostList, host)) {
    return "rabby";
  }
  return calcIsGray(host, 0.05) ? "rabby" : "default";
};

export const patchProvider = (provider: any) => {
  const mode = getProviderMode(window.location.hostname);
  try {
    if (mode === "metamask") {
      delete provider.isRabby;
      provider.isMetaMask = true;
      return;
    }
    if (mode === "rabby") {
      delete provider.isMetaMask;
      provider.isRabby = true;
      return;
    }
    if (mode === "default") {
      provider.isMetaMask = true;
      provider.isRabby = true;
      return;
    }
  } catch (e) {
    console.error(e);
  }
};
