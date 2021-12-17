import React from 'react'
import ReactDOM from 'react-dom'
import './reset.css'
import './index.css'
import SelectionSort from './SelectionSort.js'
import registerServiceWorker from './registerServiceWorker'
const finishCounter = {
  ALGORITHMS: [],
  COUNT: 0
}
ReactDOM.render(
  <SelectionSort finishCounter={finishCounter} />,
  document.getElementById('root')
)
registerServiceWorker()
