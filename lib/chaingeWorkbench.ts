import BigNumber from "bignumber.js"
import { checkOrder, getAggregateQuote, getAggregateSwap, getAssets, getBridgeQuote, getChain, getOrderIdByHash, getTokenInfo, getVaultAddress, supportNevmChain } from "./api"
import { Token, Chain, BridgeQuoteParams, BridgeQuoteResponse, AggregateQuoteParams, AggregateQuoteResponse, AggregateSwapParams, AggregateSwapResponse, OrderIdByHashResponse, CheckOrderResponse, ChaingeWorkbenchConfig, TokenInfoParams, TokenContract, TokenInfoResponse, NevmVaultType } from "./type"
import { formatUnits, parseUnits, toHex } from "viem"
import { ErrorCode } from "."
import { formatSlippageToPerTenThousand, getStore, NevmVault, setStore, StoreKey } from "./utils"

class ChaingeWorkbench {
    channel: string = 'chainge'
    channelFeeRate: string = '0'

    inited: boolean = false
    supportChains: Chain[] = []
    supportTokens: Token[] = []
    supportNevmVault: {[key in NevmVault]?: string} = {}
    constructor(config?: ChaingeWorkbenchConfig) {
        const { channel = 'chainge', globalChannelFeeRate = '0' } = config || {}
        this.channel = channel
        this.channelFeeRate = globalChannelFeeRate

        this._init()
    }
    
    private async _init() {
        const requestList = [getChain(), getAssets(), getVaultAddress()]
        const result = await Promise.all(requestList)
        if(result.length) {
            const [chains, tokens, vaultAddress] = result
            this.supportChains = chains.data as Chain[]
            this.supportTokens = tokens.data as Token[]
            this.supportNevmVault = vaultAddress.data as {[key in NevmVault]?: string}

            if(this.supportChains.length && this.supportTokens.length) {
                this.inited = true
            }
        }
    }

    private _getTokenInfoBySymbol(symbol: string, curChain: string) {
        const tokenInfo = this.supportTokens.find((item: Token) => item.symbol === symbol)
        if(tokenInfo) {
            if(!tokenInfo.chainList.includes(curChain)) return null
            const contracts = tokenInfo.contracts[curChain]
            return {
                ...tokenInfo,
                ...contracts
            }
        } else {
            return null
        }
    }

    private _getTokenInfoByAddress(address: string, curChain: string) {
        const importedList =  getStore(StoreKey.ImportedList) || []
       const tempTokenList: Token[] = [...this.supportTokens, ...importedList]
       for(let i = 0; i< tempTokenList.length; i++) {
            const tokenInfo = tempTokenList[i]
            if(!tokenInfo.chainList.includes(curChain)){
                continue
            }
            const contracts = tokenInfo.contracts[curChain]
            if(contracts.address.toLowerCase() !== address.toLowerCase()) {
                continue
            }
            return {
                ...tokenInfo,
                ...contracts
            }
       }
       return null
    }

    private _getChainInfoByNickName(nickName: string) {
        for(let i = 0; i< this.supportChains.length; i++) {
            const chainInfo = this.supportChains[i]
            if(chainInfo.nickName === nickName) {
                return chainInfo
            }
       }
       return null
    }

    private _getChainInfoByChainId(chainId: string) {
        const chainInfo = this.supportChains.find((item: Chain) => item.network === chainId)
        if(chainInfo) {
            return chainInfo
        }
        return null
    }

    public getImportedTokens() {
        const importedList = getStore(StoreKey.ImportedList) || []
        return importedList
    }

    async getTokenInfo(params: TokenInfoParams) {
        const tokenResult = await getTokenInfo(params)
        if(tokenResult && tokenResult.code === 0) {
            const { tokenAddress, name, symbol, chain, decimals, iconURI } = tokenResult.data as TokenInfoResponse
            const chainInfo = this._getChainInfoByNickName(chain)
            if(!chainInfo) {
                return {
                    code: 1103,
                    msg: ErrorCode['1103'],
                    data: null
                }
            }
            const contracts: {[key: string]: Partial<TokenContract>} = {
                [chainInfo.nickName]: {
                    address: tokenAddress,
                    decimals: (+decimals),
                    disableBridge: true,
                }
            }

            const chainList = [chainInfo.nickName]
            const tempTokenInfo: Partial<Token> = {
                index: 999990001,
                symbol: symbol,
                name: name,
                delisted: false,
                imported: true,
                contracts: contracts as any,
                iconURI,
                chainList,
                importedAddress: `${chain}_${tokenAddress}`.toLowerCase()
            }

            const importedList =  getStore(StoreKey.ImportedList) || []
            let newImportedList = []
            if(importedList.length) {
                const tempImportedList = [...importedList]
                const index = tempImportedList.findIndex(item => item.importedAddress === tempTokenInfo.importedAddress)
                if(index <= -1) {
                    tempImportedList.push(tempTokenInfo)
                }
                newImportedList = tempImportedList
            } else {
                newImportedList = [tempTokenInfo]
            }
            setStore(StoreKey.ImportedList, newImportedList)
            return tokenResult
        }
        return tokenResult
    }

    async getBridgeQuote(params: BridgeQuoteParams, toUserAddress: string) {
        if(!this.inited) throw new Error('Initialization is not complete')
        if(!toUserAddress) {
            return {
                code: 1100,
                msg: ErrorCode['1100'],
                data: null
            }
        }
        if(!params?.channelFeeRate) {
            params['channelFeeRate'] = this.channelFeeRate
        }
        const quoteResult = await getBridgeQuote(params)
        if(quoteResult && quoteResult.code === 0) {
            const { symbol, toChain, fromChain, amount } = params
            const { price, outAmount, serviceFee, gasFee, serviceFeeRate } = quoteResult.data as BridgeQuoteResponse

            const fromTokenInfo = this._getTokenInfoBySymbol(symbol, fromChain)
            const toTokenInfo = this._getTokenInfoBySymbol(symbol, toChain)
            const fromChainInfo = this._getChainInfoByNickName(fromChain)
            
            if(!fromTokenInfo || !toTokenInfo || !fromChainInfo || fromTokenInfo.disableBridge || toTokenInfo.disableBridge) {
                return {
                    code: 1200,
                    msg: ErrorCode['1200'],
                    data: null
                }
            }
            
            const outAmountBI = BigInt(outAmount)
            const serviceFeeBI = BigInt(serviceFee)
            const gasFeeBI = BigInt(gasFee)
        
            const realOutAmountBI = outAmountBI - serviceFeeBI - gasFeeBI
            if(realOutAmountBI <= BigInt(0)) {
                return {
                    code: 1102,
                    msg: ErrorCode['1102'],
                    data: null
                }
            }
            // const priceBN = BigNumber(price)
            const toDecimal = +toTokenInfo.decimals
        
            const realOutAmountHr = formatUnits(realOutAmountBI, toDecimal)
            // const realUsdOutAmountHr = BigNumber(realOutAmountHr).multipliedBy(priceBN).toString()
        
            const serviceFeeHr = formatUnits(serviceFeeBI, toDecimal)
            // const usdServiceFee = BigNumber(serviceFeeHr).multipliedBy(priceBN).toString()
            
            const gasFeeHr = formatUnits(gasFeeBI, toDecimal)
            // const usdGasFee = BigNumber(gasFeeHr).multipliedBy(priceBN).toString()

            const exportStr = `1_${realOutAmountBI.toString()};2_${params.channelFeeRate};3_2;4_${realOutAmountBI.toString()};5_${toChain}`;
            const shortOrderStr = `${this.channel}:${toChain}:${toTokenInfo.address}:${toUserAddress}:0:${exportStr}`
            const orderHex = toHex(shortOrderStr);

            const burnable = fromTokenInfo?.burnable || false
            const fromTokenAddress = fromTokenInfo.address

            const feeUnit = toTokenInfo.symbol

            let contractArgs: any = []
            let proxy = ''
            let contractMethod = ''

            if(params.fromChain !== 'TRX' && supportNevmChain.includes(params.fromChain as NevmVaultType)) {
                contractMethod = 'transfer'
                proxy = this.supportNevmVault[params.fromChain as NevmVaultType] as string
                if(params.fromChain === 'KAS') {
                    contractArgs = exportStr
                } else {
                    contractArgs = shortOrderStr
                }
            } else {
                contractMethod = 'vaultOut'
                contractArgs = [fromTokenAddress, amount, burnable, orderHex]
                proxy = fromChainInfo.builtInMinterProxyV2
            }

            return {
                code: 0,
                msg: 'success',
                data: {
                    outAmount: realOutAmountHr,
                    // outAmountUsd: realUsdOutAmountHr,
            
                    serviceFee: serviceFeeHr,
                    // serviceFeeUsd: usdServiceFee,
            
                    gasFee: gasFeeHr,
                    // gasFeeUsd: usdGasFee,

                    feeUnit: feeUnit,
            
                    serviceFeeRate,
                    price,

                    proxy: proxy,
                    contractMethod: contractMethod,
                    contractArgs: contractArgs
                }
            }
        }
        return quoteResult
    }

    async getAggregateQuote(params: AggregateQuoteParams, toUserAddress: string, customSlippage: string = '') {
        if(!this.inited) throw new Error('Initialization is not complete')
        if(!toUserAddress) {
            return {
                code: 1100,
                msg: ErrorCode['1100'],
                data: null
            }
        }
        if(customSlippage) {
            if(+customSlippage < 0.01 && +customSlippage > 50) {
                return {
                    code: 1101,
                    msg: ErrorCode['1101'],
                    data: null
                }
            }
        }
        if(!params?.channelFeeRate) {
            params['channelFeeRate'] = this.channelFeeRate
        }
        if(params.fromChain === params.toChain && params.fromChain === 'SOL') {
            params.direct = true
            params.slippage = formatSlippageToPerTenThousand(customSlippage || '1')
        }
        const quoteResult = await getAggregateQuote(params)
        if(quoteResult && quoteResult.code === 0) {
            const { fromAmount, fromTokenAddress, fromChain, toTokenAddress, toChain, channelFeeRate } = params
            const { chain, chainDecimal, aggregator, outAmount, gasFee, serviceFeeRate, serviceFee, slippage, priceImpact, routeSummary = '' } = quoteResult.data as AggregateQuoteResponse

            const fromTokenInfo = this._getTokenInfoByAddress(fromTokenAddress, fromChain)
            const toTokenInfo = this._getTokenInfoByAddress(toTokenAddress, toChain)
            const executChainInfo = this._getChainInfoByChainId(chain)
            const fromChainInfo = this._getChainInfoByNickName(fromChain)
            
            if(!fromTokenInfo || !toTokenInfo || !executChainInfo || !fromChainInfo) {
                return {
                    code: 1300,
                    msg: ErrorCode['1300'],
                    data: null
                }
            }
            const executChainNickName = executChainInfo.nickName

            const outAmountBI = BigInt(outAmount)
            const serviceFeeBI = BigInt(serviceFee)
            const gasFeeBI = BigInt(gasFee)
        
            const realOutAmountBI = outAmountBI - serviceFeeBI - gasFeeBI
            if(realOutAmountBI <= BigInt(0)) {
                return {
                    code: 1102,
                    msg: ErrorCode['1102'],
                    data: null
                }
            }

            let isDirect = false 
            // 
            if(fromChain === toChain && executChainInfo.nickName === fromChain) {
                // direction 
                if(!supportNevmChain.includes(params.fromChain as NevmVaultType)) {
                    isDirect = true
                    if(!fromChainInfo.builtInSwapProxy) {
                        return {
                            code: 1300,
                            msg: ErrorCode['1300'],
                            data: null
                        }
                    }
                }
            }

            const tempSlippage = customSlippage || slippage
            const slippageTenThousand = formatSlippageToPerTenThousand(tempSlippage)

            const toDecimal = +toTokenInfo.decimals
        
            const realOutAmountHr = formatUnits(realOutAmountBI, chainDecimal)
            // const realUsdOutAmountHr = BigNumber(realOutAmountHr).multipliedBy(priceBN).toString()
        
            const serviceFeeHr = formatUnits(serviceFeeBI, chainDecimal)
            // const usdServiceFee = BigNumber(serviceFeeHr).multipliedBy(priceBN).toString()
            
            const gasFeeHr = formatUnits(gasFeeBI, chainDecimal)
            // const usdGasFee = BigNumber(gasFeeHr).multipliedBy(priceBN).toString()

            const expectOutAmountBI = parseUnits(realOutAmountHr, +toDecimal)
            const miniOutAmount = BigNumber(realOutAmountHr).multipliedBy(BigNumber(1 - ( +tempSlippage * 0.01))).toString()
            const miniOutAmountBI = parseUnits(miniOutAmount, +toDecimal)

            const exportStr = `1_${expectOutAmountBI.toString()};2_${channelFeeRate};3_2;4_${miniOutAmountBI.toString()};5_${executChainNickName}`;
            const shortOrderStr = `${this.channel}:${toChain}:${toTokenInfo.address}:${toUserAddress}:${slippageTenThousand}:${exportStr}`
            const orderHex = toHex(shortOrderStr);

            const burnable = fromTokenInfo?.burnable || false
            // const fromTokenAddress = fromTokenInfo.address

            const feeUnit = toTokenInfo.symbol
            let contractArgs: any = []
            let proxy = ''
            let contractMethod = ''


            if(isDirect) {
                const swapParams: AggregateSwapParams = {
                    chain: fromChain,
                    aggregator,
                    fromTokenAddress: fromTokenAddress,
                    fromDecimal: fromTokenInfo.decimals + '',
                    fromAmount: fromAmount,
                    toTokenAddress: toTokenAddress,
                    toDecimal: toTokenInfo.decimals + '',
                    sender: fromChainInfo?.builtInSwapProxy,
                    recipient: fromChainInfo?.builtInSwapProxy,
                    slippage: slippageTenThousand,
                    allowPartialFill: true,
                    routeSummary
                }
                const swapResponse = await getAggregateSwap(swapParams)
                if(swapResponse && swapResponse.code === 0) {
                    const { to, data } = swapResponse.data as AggregateSwapResponse
                    contractArgs = [fromTokenAddress, fromAmount, to, toTokenAddress, toUserAddress, miniOutAmountBI.toString(), data, orderHex]
                    proxy =  fromChainInfo.builtInSwapProxy
                    contractMethod = 'swap'
                } else {
                    return swapResponse
                }
            } else {
                if(params.fromChain !== 'TRX' && supportNevmChain.includes(params.fromChain as NevmVaultType)) {
                    if(params.fromChain === 'SOL') {
                        contractArgs = `${toHex(aggregator)}_${toHex(routeSummary)}`
                    } else if(params.fromChain === 'KAS') {
                        contractArgs = exportStr
                    } else {
                        contractArgs = shortOrderStr
                    }
                    contractMethod = 'transfer'
                    proxy = this.supportNevmVault[params.fromChain as NevmVaultType] as string
                } else {
                    contractArgs = [fromTokenAddress, fromAmount, burnable, orderHex]
                    contractMethod = 'vaultOut'
                    proxy= fromChainInfo.builtInMinterProxyV2
                }
            }

            return {
                code: 0,
                msg: 'success',
                data: {
                    outAmount: realOutAmountHr,
                    // outAmountUsd: realUsdOutAmountHr,

                    miniOutAmount,
            
                    serviceFee: serviceFeeHr,
                    // serviceFeeUsd: usdServiceFee,
            
                    gasFee: gasFeeHr,
                    // gasFeeUsd: usdGasFee,

                    feeUnit: feeUnit,
            
                    serviceFeeRate,

                    priceImpact,

                    isDirect,

                    proxy: proxy,
                    contractMethod: contractMethod,
                    contractArgs: contractArgs
                }
            }

        }
        return quoteResult
    }

    async checkOrder(chain: string, hash: string) {
        const idResponse = await getOrderIdByHash(chain, hash)
        if(idResponse && idResponse.code === 0) {
            const { id } = idResponse.data as OrderIdByHashResponse
            
            const orderResponse = await checkOrder(id)
            if(orderResponse && orderResponse.code === 0) {
                return orderResponse.data as CheckOrderResponse
            } else {
                return orderResponse
            }
        } else {
            return idResponse
        }
    }
}

export default ChaingeWorkbench