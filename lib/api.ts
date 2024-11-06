import axios from "./request/index";
import { AggregateQuoteParams, AggregateSwapParams, ApiResponse, BalanceParams, BridgeQuoteParams, Chain, NevmVaultType, PriceParams, Token, TokenContract, TokenInfoParams } from "./type";
import { ICON_URL, NevmVault } from "./utils";
export const supportNevmChain: NevmVaultType[]  = ['SOL', 'KAS', 'KOIN', 'TRX', 'APT', 'RADIX']

// https://api2.chainge.finance/v1/getChain
export const getChain = async () => {
    const result:  Partial<ApiResponse> = await axios.get("/getChain");
    if(result && result.code === 0) {
        const { data } = (result || {}) as Partial<ApiResponse>
        if(data) {
            const { list: chainList } = data as {list: Chain[] | null}
            if(!chainList) {
                result.data = []
                return result
            }
            const supporChain = chainList.filter(
                (item: Chain) => !(item.delisted || item.disabled) && ([1].includes(item.family) || supportNevmChain.includes(item.nickName as NevmVaultType))
            );
            supporChain.forEach((item: Chain) => {
                // format pairToken
                item['pairToken'] = item.pairToken || 'USDT'

                item['iconURI'] = `${ICON_URL}${item.chainIndex}_${'chain'}_color.png`
            });
            result.data = supporChain
            return result
        }
        result.data = []
        return result
    }
    result.data = []
    return result
};

// https://api2.chainge.finance/v1/getAssets
export const getAssets = async () => {
    const result: Partial<ApiResponse> = await axios.get("/getAssets");
    if(result && result.code === 0) {
        const { data } = (result || {}) as Partial<ApiResponse>
        if(data) {
            const { list: tokenList } = data as {list: Token[] | null}
            if(!tokenList) {
                result.data = []
                return result
            }
            let supporToken = tokenList.filter((item: Token) => item.visible && !item.delisted);
            supporToken = tokenList.map((item: Token) => {
                const contractObj = item.contracts;
          
                const chainNameKey = Object.keys(contractObj);
                const availableContracts: { [key: string]: TokenContract } = {};
                chainNameKey.forEach((item) => {
                  if (!contractObj[item].delisted) {
                    availableContracts[item] = contractObj[item];
                  }
                });
                const availableChains = Object.keys(availableContracts);
          
                item["chainList"] = availableChains;
                item["contracts"] = availableContracts;

                item['iconURI'] = `${ICON_URL}${item.index}_${item.symbol}_color.png`
                return item;
              });
            result.data = supporToken
            return result
        }
        result.data = []
        return result
    }
    result.data = []
    return result
};

// https://api2.chainge.finance/v1/getVaultAddress
export const getVaultAddress = async () => {
    const result: Partial<ApiResponse> = await axios.get("/getVaultAddress");
    if(result && result.code === 0) {
        const { data } = (result || {}) as Partial<ApiResponse>
        if(data) {
            let supportNevmVaultAddr: {[key in NevmVault]?: string} = {}
            const { list = {} } = data as {list: {[key in NevmVault]?: string}}
            supportNevmChain.forEach((item: NevmVaultType) => {
                const value = list[item]
                if(value) {
                    supportNevmVaultAddr[item] = value
                }
            })
            result.data = supportNevmVaultAddr
            return result
        }
    }
    result.data = {}
    return result
};

// https://api2.chainge.finance/v1/getAssetsByChain?chain=FSN
export const getAssetsByChain = async (chain: string) => {
    const response = await axios.get("/getAssetsByChain", {params: {
        chain: chain
    }});
    return response
};

// https://api2.chainge.finance/v1/getBalance?chain=KOIN&address=15Rvm1urRjFSbviHD2fmXRN9BtB8RYiMUf&contractAddress=15zQzktjXHPRstPYB9dqs6jUuCUCVvMGB9
export const getBalance = async (params: BalanceParams) => {
    const response = await axios.get("/getBalance", {params});
    return response as Partial<ApiResponse>
};

// https://api2.chainge.finance/v1/getPrice?chain=FSN&symbol=XCHNG&contractAddress=0xab1f7e5bf2587543fe41f268c59d35da95f046e0
export const getPrice = async (params: PriceParams) => {
    const response = await axios.get("/getPrice", {params});
    return response as Partial<ApiResponse>
};

// https://api2.chainge.finance/v1/getAggregateQuote?fromAmount=13198860&fromTokenAddress=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB&fromDecimal=6&fromChain=SOL&toTokenAddress=Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB&toDecimal=6&toChain=SOL&direct=true&slippage=100
export const getAggregateQuote = async (params: AggregateQuoteParams) => {
    const response = await axios.get("/getAggregateQuote", {params});
    return response as Partial<ApiResponse>
};

// https://api2.chainge.finance/v1/getBridgeQuote?amount=100000000&symbol=USDT&fromChain=FSN&toChain=BNB
export const getBridgeQuote = async (params: BridgeQuoteParams) => {
    const response = await axios.get("/getBridgeQuote", {params});
    return response as Partial<ApiResponse>
};

// https://api2.chainge.finance/v1/getTokenInfo?chain=FSN&tokenAddress=0x585f70e031c9c10e99b7904a741dc54fe1fed197
export const getTokenInfo = async (params: TokenInfoParams) => {
    const response = await axios.get("/getTokenInfo", {params});
    return response as Partial<ApiResponse>
};

// https://api2.chainge.finance/v1/getAggregateSwap?chain=BNB&aggregator=Kyber&fromTokenAddress=0x55d398326f99059ff775485246999027b3197955&fromDecimal=18&fromAmount=1000000000000000000&toTokenA ddress=0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d&toDecimal=18&sender=0 xbffca20712e0906d1ef74f3e0a7cbe050aa6228a&recipient=0xbffca20712e0906d1ef74 f3e0a7cbe050aa6228a&slippage=100&allowPartialFill=true&routeSummary=H4sIAAAAAAAA%2F5yST2vcMBDFv8uc3aL%2F0viWQAOBlpbQnkIOsjXymnjlxdKmG5Z892I72W4oXWh9G%2FOT3nt6c4QyPlK6TVADO2gdJDopTERkGmO0ViunhTKIyIRtJEeLWkMFfjvuU 1nOcfbHdwb8yGFmoHpT%2BuKnRyrfpr6lqyffD74ZCOroh0yvzNd9Wew431rjNW9b1Cy gEyIY1zgZifuAtpGiDdqxcFJbDyKiUtIh58xwIbXh58Dqh32cExnOmWKonUCE3%2BIXHXY %2Bz3mEXmN2Pi8g1CDP43c%2BvykJhswoKZTSVilnLVRAhzL5GyKojxCJrhZ3Mw0VtBs%2FdXRDdP0MNUAFfb5N17t8shCJ7qil%2FommGXipYBr3haC%2Bvz%2FCbhyH5fU4KaY 0i44EbxrjFLJgA3LfKCGcc7GRwbB41sy%2F7sD%2FljX0277cUdlP6V3w%2FNPvTj8ubdWF nunQbnzq5j7SuO3nKz%2FksjRYLW%2FzmVJXNlCLdfz%2BvPs7%2B2luCeq0H4bXytbh5 eHh%2FfwrAAD%2F%2FxSZUvRHAwAA
export const getAggregateSwap = async (params: AggregateSwapParams) => {
    const result = await axios.get('/getAggregateSwap', {params})
    return result as Partial<ApiResponse>
}

// https://api2.chainge.finance/v1/getOrderIdByHash?chain=BNB&hash=0x87d9d91283b4515a5e0514ae4363362318ccf3720c77582d233b983fd7dd01fd
export const getOrderIdByHash = async (chain: string, hash: string) => {
    const params = {
        chain,
        hash: hash
    }
    const result = await axios.get('/getOrderIdByHash', {params})
    return result as Partial<ApiResponse>
}

// https://api2.chainge.finance/v1/checkOrder?id=30000002832
export const checkOrder = async (id: string) => {
    const result = await axios.get('/checkOrder', {params: { id }})
    return result as Partial<ApiResponse>
}