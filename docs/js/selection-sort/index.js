// @flow

/* eslint-env browser */

export function selectionSortFactory(
  {
    CONTAINER_ID = "",
    SHOW_WORKING = true,
    FPS = 10,
    ACCELLERATION = 100,
    CLICK = 1,
    COLS = 5,
    ROWS = 5,
    MAX_SECONDS_TRANSITION_INTERVAL = 2,
    CONSTANT_TRANSITION_SPEED = false,
    LOOP = true,
    RELOAD_INTERVAL = 1000,
  } /*: config */,
  gridDisplay /*: function */,
) /* :Object */ {
  const config = {
    CONTAINER_ID,
    SHOW_WORKING,
    FPS,
    ACCELLERATION,
    CLICK,
    COLS,
    ROWS,
    MAX_SECONDS_TRANSITION_INTERVAL,
    CONSTANT_TRANSITION_SPEED,
    LOOP,
    RELOAD_INTERVAL,
  };
  // The display
  const D = gridDisplay();
  config.CLICK = D.getClick(
    config.SHOW_WORKING,
    config.FPS,
    config.ACCELLERATION,
  );

  function run() /*: void */ {
    // The input
    const a = makeArrayToSort(config.COLS, config.ROWS);
    // The display
    D.displayGrid(
      a,
      config.COLS,
      config.ROWS,
      config.CONTAINER_ID,
      config.SHOW_WORKING,
    );
    D.enableShowWorkingToggleControl(config);
    loop(a, 0);
  }

  function loop(a /*: Array<Object> */, i /*: number */) /*: null|void */ {
    // reloadPageIfFinishedLooping(a.length, i)
    if (i < a.length) {
      D.setCellDisplay(
        i,
        "add",
        "active",
        config.CONTAINER_ID,
        config.SHOW_WORKING,
      );
      findMinIndex(a, i).then((minIndex) => {
        // If this one is already in the right position
        // jump to the next cell and return out
        if (minIndex === i) {
          skipToNextLoop(a, i, minIndex);
          return null;
        }
        swapAndLoopAgain(a, i, minIndex);
      });
    } else if (config.LOOP) {
      return reloadIfFinishedLooping(config.RELOAD_INTERVAL);
    }
  }

  function setReload(reloadInterval /*: number */) /*: void */ {
    setTimeout(() => {
      run();
    }, reloadInterval);
  }

  function reloadIfFinishedLooping(reloadInterval /* :number */) /* :void */ {
    setReload(reloadInterval);
  }

  function skipToNextLoop(
    a /* :Array<Object> */,
    i /* :number */,
    minIndex /* :number */,
  ) /* :void */ {
    D.setCurrentCellDisplayToActive(
      i,
      config.CONTAINER_ID,
      config.SHOW_WORKING,
    );
    setTimeout(() => {
      D.clearActiveCellsDisplay(
        i,
        minIndex,
        config.CONTAINER_ID,
        config.SHOW_WORKING,
      );
      loop(a, ++i);
    }, config.CLICK * 1); // eslint-disable-line no-undef
  }

  function swapAndLoopAgain(
    a /* :Array<Object> */,
    i /* :number */,
    minIndex /* :number */,
  ) /* :void */ {
    setTimeout(() => {
      D.swapCells(
        a,
        i,
        minIndex,
        config.CONTAINER_ID,
        config.CONSTANT_TRANSITION_SPEED,
        config.MAX_SECONDS_TRANSITION_INTERVAL,
        config.COLS,
        config.ROWS,
      )
        .then(() => {
          D.swapActiveCellsDisplay(
            i,
            minIndex,
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
          return swapArrayElements(a, i, minIndex);
        })
        .then((a) => {
          setTimeout(() => {
            D.clearActiveCellsDisplay(
              i,
              minIndex,
              config.CONTAINER_ID,
              config.SHOW_WORKING,
            );
            ++i;
          }, config.CLICK * 1); // eslint-disable-line no-undef
          setTimeout(() => {
            loop(a, i);
          }, config.CLICK * 2); // eslint-disable-line no-undef
        })
        .catch((e) => {
          console.error(e);
          throw new Error(e);
        });
    }, config.CLICK * 1); // eslint-disable-line no-undef
  }

  function findMinIndex(
    a /* :Array<Object> */,
    j /* :number */,
  ) /* :Promise<number> */ {
    let minValue = a[j].value;
    let minIndex = j;
    return new Promise((resolve) => {
      const intervalID = setInterval(() => {
        D.setCellDisplay(
          j,
          "remove",
          "actively-looking",
          config.CONTAINER_ID,
          config.SHOW_WORKING,
        );
        ++j;
        if (j >= a.length) {
          clearInterval(intervalID);
          D.setCellDisplay(
            minIndex,
            "remove",
            "min",
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
          D.setCellDisplay(
            minIndex,
            "remove",
            "actively-looking",
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
          D.setCellDisplay(
            minIndex,
            "add",
            "active-min",
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
          return resolve(minIndex);
        }
        D.setCellDisplay(
          j,
          "add",
          "actively-looking",
          config.CONTAINER_ID,
          config.SHOW_WORKING,
        );
        if (a[j].value < minValue) {
          D.setCellDisplay(
            minIndex,
            "remove",
            "min",
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
          minValue = a[j].value;
          minIndex = j;
          D.setCellDisplay(
            minIndex,
            "add",
            "min",
            config.CONTAINER_ID,
            config.SHOW_WORKING,
          );
        }
      }, config.CLICK * 1); // eslint-disable-line no-undef
    });
  }

  function swapArrayElements(
    a /*: Array<Object> */,
    i /*: number */,
    minIndex /*: number */,
  ) /* :Array<Object> */ {
    const tmpValue = a[i].value;
    a[i].value = a[minIndex].value;
    a[minIndex].value = tmpValue;
    return a;
  }

  function makeArrayToSort(
    cols /*: number */,
    rows /*: number */,
  ) /* :Array<Object> */ {
    const numItems = cols * rows;
    const a = [];
    let randomNumber = 0;
    for (let i = 0; i < numItems; i++) {
      randomNumber = Math.random();
      a.push({
        value: randomNumber,
        id: "_" + i.toString(),
      });
    }
    //
    return a;
  }

  return {
    config,
    run,
    loop,
    skipToNextLoop,
    swapAndLoopAgain,
    findMinIndex,
    swapArrayElements,
    makeArrayToSort,
    setReload,
  };
}
