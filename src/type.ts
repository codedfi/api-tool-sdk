export interface ChaingeWorkbenchConfig {
    channel?: string // default chainge
    globalChannelFeeRate?: string 
}

export interface ApiResponse {
    code: number
    msg: string
    data: unknown
}

export interface Chain {
	chainIndex: number;
	fullName: string;
	nickName: string;
	baseCoin: string;
	decimals: number;
	poll: number;
	confirmations: number;
	family: number;
	sigMethod: number;
	network: string;
	bip44Path: string;
	publicEndpoint: string;
	privateEndpoint: string;
	scanUrl: string;
	needNonce: boolean;
	disabled: boolean;
	delisted: boolean;
	builtInMinterProxy: string;
	builtInMinterProxyV2: string;
	builtInSwapProxy: string;
	weth: string;
	gasPriceAmplifier: string;
	swapGasMin: string;
	swapGasMax: string;
    pairToken: string;
	iconURI: string;
}

export interface Token {
	index: number;
	name: string;
	symbol: string;
	cmcid: number;
	delisted: boolean;
	visible: boolean;
	contracts: {[key: string]: TokenContract};
    chainList: string[];
	iconURI: string;
	imported: boolean; // imported flag
	importedAddress?: string
}

export interface TokenContract {
    address: string;
	decimals: number;
	burnable: boolean;
    disableBridge: boolean;
    delisted: boolean;
}

export interface BalanceParams {
	chain: string;
	address: string;
	contractAddress: string;
}

export interface PriceParams {
	chain: string;
	symbol: string;
	contractAddress: string;
}

export interface TokenInfoParams {
	chain: string;
	tokenAddress: string;
}

export interface AggregateQuoteParams {
    fromAmount: string;
    fromTokenAddress: string;
    fromDecimal: string;
    fromChain: string;
    toTokenAddress: string;
    toDecimal: string;
    toChain: string;
    direct?: boolean; // for sol default true
    slippage?: string; // for sol
    channelFeeRate?: string; // default: 0
}

export interface BridgeQuoteParams {
    amount: string;
    symbol: string;
    fromChain: string;
    toChain: string;
	channelFeeRate?: string; // default: 0
}

export interface AggregateSwapParams {
	chain: string
	aggregator: string
	fromTokenAddress: string
	fromDecimal: string
	fromAmount: string
	toTokenAddress: string
	toDecimal: string
	sender: string
	recipient: string
	slippage: string
	allowPartialFill: boolean
	routeSummary: string
}

export interface BridgeQuoteResponse {
	price: string;
	outAmount: string;
	outAmountUsd: string;
	serviceFee: string;
	gasFee: string;
	serviceFeeRate: string;
}

export interface AggregateQuoteResponse {
	chain: string;
	chainDecimal: number;
	aggregator: string;
	outAmount: string;
	outAmountUsd: string;
	gasFee: string;
	serviceFeeRate: string;
	serviceFee: string;
	slippage: string;
	priceImpact: string;
	routeSummary: string;
}


export interface AggregateSwapResponse {
	amountOut: string;
	from: string;
	to: string;
	gas: string;
	value: string;
	data: string;
}

export interface OrderIdByHashResponse {
	id: string;
}

export interface CheckOrderResponse {
	status: string;
	timestamp: number;
	execHash: string;
	reason: string;
	amountOut: string;
}

export interface TokenInfoResponse {
	chain: string;
	tokenAddress: string;
	name: string;
	symbol: string;
	decimals: string;
	cmcid: string;
	cmcRank: string;
	high: string;
	low: string;
	priceChange24h: string;
	volume24h: string;
	marketCap: string;
	fullyDilutedMarketCap: string;
	circulatingSupply: string;
	totalSupply: string;
	maxSupply: string;
	iconURI: string;
	website: string[];
	twitter: any[];
	telegram?: any;
	docs: string[];
}