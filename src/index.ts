export * from './type'
export * from './api'
import ChaingeWorkbench from './chaingeWorkbench'

export const ErrorCode = {
    1100: 'Missing parameters',
    1101: 'The slippage range should be from 0.01% to 50%',
    1102: 'Cannot cover the handling fee, please enter a larger value',
    1103: 'This chain is not supported',

    1200: 'The trading pair does not support Bridge',

    1300: 'The trading pair does not support Swap'
}

export default ChaingeWorkbench
