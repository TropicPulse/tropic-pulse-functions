import VastAdapter from "./VastAdapter.js";
import AkashAdapter from "./AkashAdapter.js";
import RenderAdapter from "./RenderAdapter.js";
import SpheronAdapter from "./SpheronAdapter.js";
import FluidStackAdapter from "./FluidStackAdapter.js";
import { loadMarketplaceReputation } from "./MarketplaceReputation.js";

export const marketplaces = [
  VastAdapter,
  AkashAdapter,
  RenderAdapter,
  SpheronAdapter,
  FluidStackAdapter
];
// Load reputation on miner startup
loadMarketplaceReputation();