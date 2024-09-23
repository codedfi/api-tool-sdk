import ChaingeWorkbench from '../lib/index'

const chaingeWorkbench  = new ChaingeWorkbench({
    channel: 'chainge',
    globalChannelFeeRate: '0'
})

const fnTestGetBridgeQuote = async () => {
    const params = {
        amount: '1000000000',
        symbol: 'USDT',
        fromChain: 'FSN',
        toChain: 'BNB',
    }
    const result = await chaingeWorkbench.getBridgeQuote(params, '0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8')    
    console.log('Bridge Quote Result:', result)
}

const fnTestGetAggregateQuote = async () => {
    const params = {
        fromAmount: '1000000000',
        fromTokenAddress: '0x8a20c13b42d7fe418f10f922f2cee06246c24269',
        fromDecimal: '6',
        fromChain: 'FSN',
        toTokenAddress: '0xb712d62fe84258292d1961b5150a19bc4ab49026',
        toDecimal: '18',
        toChain: 'ETH',
    }
    const result = await chaingeWorkbench.getAggregateQuote(params, '0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8')
    console.log('Aggregate Quote Result:', result)
}

const fnTestGetSwapQuote = async () => {
    const params = {
        fromAmount: '1000000000',
        fromTokenAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        fromDecimal: '6',
        fromChain: 'ETH',
        toTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        toDecimal: '18',
        toChain: 'ETH'
    }
    const result = await chaingeWorkbench.getAggregateQuote(params, '0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8')
    console.log('Swap Quote Result:', result)
}

export const fnClick = (element: any, type: string) => {
    element.addEventListener('click', () => {
        if(type === 'bridge') {
            fnTestGetBridgeQuote()
        }

        if(type === 'aggregate') {
            fnTestGetAggregateQuote()
        }

        if(type === 'swap') {
            fnTestGetSwapQuote()
        }
    })
}