// @flow

import { h } from "../web_modules/preact.js";
import {
  useContext,
  useEffect,
  useState,
} from "../web_modules/preact/hooks.js";
import { html } from "../web_modules/htm/preact.js";
import { AppContext } from "./AppContext.js";
import { selectionSortFactory } from "./selection-sort/index.js";
import { gridDisplay } from "./grid-display/index.js";
// CSS
// import {
//   rawStyles,
//   createStyles,
//   setSeed,
// } from "../web_modules/simplestyle-js.js";

// NOTE: the actual type of ALGORITHMS and COUNT don't have any effect
/*::
type Props = {
  containerId: string,
  finishCounter: {
    ALGORITHMS: Array<Object>,
    COUNT: number
  }
}
*/
const SelectionSort /*: function */ = (props /*: Props */) => {
  //   const [state /*: AppState */, dispatch] = useContext(AppContext);
  //   const [count /*: number */, setCount] = useState(props.count);

  useEffect(() => {
    // Config
    const selectionConf = {
      CONTAINER_ID: props.containerId,
      SHOW_WORKING: true,
      FPS: 10,
      ACCELLERATION: 1,
      MAX_SECONDS_TRANSITION_INTERVAL: 2,
      COLS: 4,
      ROWS: 4,
      LOOP: true,
      RELOAD_INTERVAL: 2000,
      CONSTANT_TRANSITION_SPEED: false,
      FINISH_COUNTER: props.finishCounter,
    };
    // --------------------------------- //
    // SELECTION SORT
    // --------------------------------- //
    const selectionSort = selectionSortFactory(selectionConf, gridDisplay);
    // I shouldn't, but I am. Adding this algorithm  to the FINISH_COUNTER.ALGORITHMS prop
    selectionConf.FINISH_COUNTER.ALGORITHMS.push(selectionSort);
    selectionSort.run();
  }, []);
  return html`
    <div id=${props.containerId} className="viz selection-sort"></div>
  `;
};

export default SelectionSort;
