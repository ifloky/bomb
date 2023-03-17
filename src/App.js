import './App.css';
import { useEffect, useState } from "react";

function App() {

  const BOMBS_COUNT = 40;
  const WIDTH = 16;
  const HEIGHT = 16;

  const cellsCount = WIDTH * HEIGHT;
  const startArr = [...Array(cellsCount).fill('-1px 49px')]

  const [arrItem, changeArrItem] = useState(startArr);

  const [start, setStart] = useState(false)
  const [explosion, setExplosion] = useState(false)
  const [timer, setTimer] = useState({ secondOne: -225, secondTwo: -225, secondThree: -225 });
  const [count, setCount] = useState({ countOne: -225, countTwo: -225, countThree: -225 });
  const [countMine, setCountMine] = useState(0);
  const [click, setClick] = useState(false);
  const [allBombs, setAllBombs] = useState({});
  const [countMineRem, setCountMineRem] = useState(BOMBS_COUNT);
  const [openCells, setOpenCells] = useState([]);
  const [buttonStates, setButtonStates] = useState({});
  const backPos = {
    0: '-28px 48px',
    1: '-2px 23px',
    2: '-28px 23px',
    3: '-53px 23px',
    4: '-79px 23px',
    5: '-105px 23px',
    6: '-130px 23px',
    7: '-156px 23px',
    8: '-182px 23px',
    9: '80px 48px',
    10: '-2px 49px',
    11: '-52px 49px',
    12: '-78px 49px',
    13: '-106px 47px'
  };

  function startGame() {
    setStart(true);
    setExplosion(false);
    setButtonStates({});
    setOpenCells([]);
    setAllBombs([...Array(cellsCount).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, BOMBS_COUNT))
    arrItem.forEach((el) => {
      el = '0px 50px'
    })
  }

  function winwin() { }

  function clickField(e) {
    if (start) {
      if (e.target.tagName !== 'BUTTON') {
        return;
      }
      const index = e.target.id;
      const column = index % WIDTH;
      const row = Math.floor(index / WIDTH);
      open(row, column, e, countMine, countMineRem);
    }
  }

  function open(row, column, e, countMine, countMineRem) {
    if (!isBomb(row, column)) {

      countMine = getCountMine(row, column, countMine);
      setOpenCells([...openCells, e.target.id]);
      arrItem[e.target.id] = backPos[countMine]
      e.target.disabled = true;
      if (countMine === 0) {
        checkNeighbor(row, column, e);
      }

      if (countMineRem === 0) {
        winwin()
      }

    } else {
      arrItem.map((val, ind) => {
        if (allBombs.includes(ind)) {
          return arrItem[ind] = '80px 48px'
        } else {
          return arrItem[ind];
        }
      });
      arrItem[e.target.id] = '54px 48px';
      setStart(false)
      setExplosion(true);
      timerStop();
    }
  }

  function getCountMine(row, column, countMine) {
    let count = 0

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        const r = row + x;
        const c = column + y;
        if (isBomb(r, c)) {
          if (r >= 0 && r < WIDTH - 1 && c >= 0 && c < HEIGHT - 1) {
            count++
          }
        }
      }
    }
    setCountMine(countMine = count)
    return countMine
  }

  function isBomb(row, column) {
    const index = row * WIDTH + column;
    return allBombs.includes(index);
  }

  function isOpenCells(ind) {
    return openCells.includes(ind.toString());
  }


  function checkNeighbor(row, column, e, countMine) {
    const visited = new Set();
    const queue = [{ row, column }];
    while (queue.length > 0) {
      const { row, column } = queue.shift();
      const id = row * WIDTH + column;
      if (visited.has(id)) continue;
      visited.add(id);
      if (!isOpenCells(row, column) && !isBomb(row, column)) {
        setOpenCells((openCells) => [...openCells, id]);
        countMine = getCountMine(row, column, countMine);
        setOpenCells([...openCells, e.target.id]);
        arrItem[e.target.id] = backPos[countMine]
        e.target.disabled = true;
        arrItem[id] = backPos[countMine]
        if (getCountMine(row, column, 0) === 0) {
          for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
              const r = row + x;
              const c = column + y;
              if (r >= 0 && r < WIDTH && c >= 0 && c < HEIGHT) {
                const neighborId = r * WIDTH + c;
                if (!visited.has(neighborId)) {
                  queue.push({ row: r, column: c });
                }
              }
            }
          }
        }
      }
    }
  }

  function timerStart() {
    setTimer({ secondOne: 0, secondTwo: -225, secondThree: -225 })
    setInterval(() => {
      setTimer((timer) => {
        return {
          secondOne: timer.secondOne <= -200 ? timer.secondOne = 25 : timer.secondOne - 25,
          secondTwo: timer.secondOne === -200 ? timer.secondTwo = -25 : timer.secondTwo,
          secondThree: timer.secondThree === -200 ? timer.secondTwo + 25 : timer.secondThree
        }
      })
    }, 100);
  };

  function timerStop() {
  }

  function setSmile(e) {
    setClick(!click)
    if (!click) {
      arrItem[e.target.id] = '-29px 49px'
    }
  }

  function leftHand(e) {
    e.preventDefault();
    if (e.button == 2) {
      arrItem[e.target.id] = backPos[11]
      e.target.disabled = true;
    }
  }



  return (
    <div className="App">
      <section className="game">
        <header className="header">
          <div className="header__count-mine">
            <span
              className="header__num header__count-num"
              style={{ backgroundPosition: count.countOne + 'px 0px' }}>
            </span>
            <span
              className="header__num header__count-num"
              style={{ backgroundPosition: count.countTwo + 'px 0px' }}>
            </span>
            <span
              className="header__num header__count-num"
              style={{ backgroundPosition: count.countThree + 'px 0px' }}>
            </span>
          </div>
          <button
            className="header__smile"
            onClick={startGame}
            style={{
              backgroundPosition:
                click ? '-96px -44px' :
                  explosion ? '-189px -44px' :
                    start ? '-50px -44px' :
                      countMine == -1 ? '-143px -44px' : '-50px - 44px'
            }}>
          </button>
          <div className="header__timer">
            <span
              className="header__num header__timer-num"
              style={{ backgroundPosition: timer.secondThree + 'px 0px' }}>
            </span>
            <span
              className="header__num header__timer-num"
              style={{ backgroundPosition: timer.secondTwo + 'px 0px' }}>
            </span>
            <span
              className="header__num header__timer-num"
              style={{ backgroundPosition: timer.secondOne + 'px 0px' }}>
            </span>
          </div>
        </header>
        <div className="game-body"
          onClick={clickField} >
          {startArr.map((el, ind) =>
            <button
              className="game-btn"
              style={{
                backgroundPosition: arrItem[ind]
              }}
              key={ind}
              id={ind}
              onContextMenu={leftHand}
              onMouseDown={setSmile}
              onMouseUp={setSmile}
              disabled={!start ? true : false}>
            </button>
          )}
        </div>
      </section>

    </div>
  );

};

export default App;
