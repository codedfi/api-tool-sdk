import ChaingeWorkbench from '../lib/index'

const chaingeWorkbench  = new ChaingeWorkbench({
    channel: 'chainge',
    globalChannelFeeRate: '0'
})

const fnTestGetBridgeQuote = async () => {
    const params = {
        amount: '1000000000',
        symbol: 'USDT',
        fromChain: 'KAS',
        toChain: 'FSN',
    }
    const result = await chaingeWorkbench.getBridgeQuote(params, '0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8')    
    console.log('Bridge Quote Result:', result)
}

const fnTestGetAggregateQuote = async () => {
    const params = {
        fromAmount: '10000000000',
        fromTokenAddress: 'CUSDT',
        fromDecimal: '8',
        fromChain: 'KAS',
        toTokenAddress: 'QEQE',
        toDecimal: '8',
        toChain: 'KAS'
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