import { fnClick } from './demo'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Chainge Finance API</h1>
    <h3>Please open the console to check the results.</h3>
    <button id="testBridge" type="button">Bridge Quote</button>
    <button id="testAggregate" type="button">Aggregate Quote</button>
    <button id="testSwap" type="button">Swap Quote</button>
  </div>
`

fnClick(document.querySelector<HTMLDivElement>('#testBridge'), 'bridge')
fnClick(document.querySelector<HTMLDivElement>('#testAggregate'), 'aggregate')
fnClick(document.querySelector<HTMLDivElement>('#testSwap'), 'swap')