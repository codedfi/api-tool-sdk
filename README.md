# Chainge Finance API TOOLS

### Installation
```
yarn add @chainge/api-tool-sdk
or
npm install @chainge/api-tool-sdk
```

## Usage
```
import ChaingeWorkbench from '@chainge/api-tool-sdk'

const chaingeWorkbench  = new ChaingeWorkbench({
    channel: 'chainge',
    globalChannelFeeRate: '0'
})

const params = {
    amount: '1000000000',
    symbol: 'USDT',
    fromChain: 'FSN',
    toChain: 'BNB',
}
const result = await chaingeWorkbench.getBridgeQuote(params, '0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8')
// result
// {
//     "code": 0,
//     "msg": "success",
//     "data": {
//         "outAmount": "999.1",
//         "serviceFee": "0.6",
//         "gasFee": "0.3",
//         "feeUnit": "USDT",
//         "serviceFeeRate": "6",
//         "price": "1",
//         "proxy": "0x3668c219b1fa8fe8175158f6ce91ded36fde9152",
//         "contractMethod": "vaultOut",
//         "contractArgs": [
//             "0x8a20c13b42d7fe418f10f922f2cee06246c24269",
//             "1000000000",
//             true,
//             "0x636861696e67653a424e423a3078353564333938333236663939303539666637373534383532343639393930323762333139373935353a3078343261363638356566323938383643626362353935416139303366303064656130643137383764383a303a315f313030303030303030303030303030303030303030303b325f303b335f323b345f313030303030303030303030303030303030303030303b355f424e42"
//         ]
//     }
// }

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
// result
// {
//     "code": 0,
//     "msg": "success",
//     "data": {
//         "outAmount": "28779.363396569997980623",
//         "miniOutAmount": "27340.39522674149808159185",
//         "serviceFee": "57.794085659999995953",
//         "gasFee": "59.88534777",
//         "feeUnit": "XCHNG",
//         "serviceFeeRate": "20",
//         "priceImpact": "0.48",
//         "isDirect": false,
//         "proxy": "0x3668c219b1fa8fe8175158f6ce91ded36fde9152",
//         "contractMethod": "vaultOut",
//         "contractArgs": [
//             "0x8a20c13b42d7fe418f10f922f2cee06246c24269",
//             "1000000000",
//             true,
//             "0x636861696e67653a4554483a3078623731326436326665383432353832393264313936316235313530613139626334616234393032363a3078343261363638356566323938383643626362353935416139303366303064656130643137383764383a3530303a315f32383737393336333339363536393939373938303632333b325f303b335f323b345f32373334303339353232363734313439383038313539323b355f46534e"
//         ]
//     }
// }


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
// result
// {
//     "code": 0,
//     "msg": "success",
//     "data": {
//         "outAmount": "0.378080592055128712",
//         "miniOutAmount": "0.37429978613457742488",
//         "serviceFee": "0",
//         "gasFee": "0",
//         "feeUnit": "ETH",
//         "serviceFeeRate": "10",
//         "priceImpact": "0.01",
//         "isDirect": true,
//         "proxy": "0x850d5097a9970dda56ef7067d79ca9ac5834450f",
//         "contractMethod": "swap",
//         "contractArgs": [
//             "0xdac17f958d2ee523a2206206994597c13d831ec7",
//             "1000000000",
//             "0x1111111254eeb25477b68fb85ed929f73a960582",
//             "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
//             "0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8",
//             "374299786134577425",
//             "0xe449022e000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000531c7ac200e611000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000001a00000000000000000000000c7bbec68d12a0d1830360f8ec58fa599ba1b0e9bda12907d",
//             "0x636861696e67653a4554483a3078656565656565656565656565656565656565656565656565656565656565656565656565656565653a3078343261363638356566323938383643626362353935416139303366303064656130643137383764383a3130303a315f3337383038303539323035353132383731323b325f303b335f323b345f3337343239393738363133343537373432353b355f455448"
//         ]
//     }
// }
```
The **proxy** field indicates the contract you need to call.
The **contractMethod** field specifies the method of the contract you need to invoke. 
The **contractArgs** field represents the parameters you need to pass to the contract method.