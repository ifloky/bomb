import './App.css';
import { useEffect, useState } from "react";

function App() {

  const BOMBS_COUNT = 56;
  const WIDTH = 16;
  const HEIGHT = 16;

  const cellsCount = WIDTH * HEIGHT;
  const arrItem = [...Array(cellsCount)];

  const [start, setStart] = useState(false)
  const [explosion, setExplosion] = useState(false)
  const [timer, setTimer] = useState({ secondOne: -225, secondTwo: -225, secondThree: -225 });
  const [count, setCount] = useState({ countOne: -225, countTwo: -225, countThree: -225 });
  const [countMine, setCountMine] = useState(0);
  const [click, setClick] = useState(false);
  const [allBombs, setAllBombs] = useState({});
  const [countMineRem, setCountMineRem] = useState(BOMBS_COUNT);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
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
    10: '-2px 49px'
  };


  function startGame() {
    setStart(true);
    setExplosion(false);
    setButtonStates({});
    setOpenCells([])
    setAllBombs([...Array(cellsCount).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, BOMBS_COUNT))
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
      open(row, column, e, countMine, countMineRem)
    }
  }

  function open(row, column, e, countMine, countMineRem, el) {
    if (!isBomb(row, column)) {
      const buttonId = e.target.id;
      setSelectedButtonId(buttonId);
      countMine = getCountMine(row, column, countMine); //сколько мин рядом
      setCountMineRem(--countMineRem); //сколько мин осталось  
      setOpenCells([...openCells, e.target.id]);
      const newButtonStates = {
        ...buttonStates,
        [e.target.id]: backPos[countMine],
      };
      setButtonStates(newButtonStates);
      e.target.disabled = true
      if (countMineRem === 0) {
        winwin()
      }
    } else {
      setExplosion(true);
      timerStop();
    }
  }

  function isBomb(row, column) {
    const index = row * WIDTH + column;
    return allBombs.includes(index);
  }

  function isBombInd(ind) {
    return allBombs.includes(ind);
  }

  function isOpenCells(ind) {
    return openCells.includes(ind.toString());
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
    setTimer({ secondOne: -225, secondTwo: -225, secondThree: -225 });
  }

  function setSmile() {
    setClick(!click)
  }

  function getCountMine(row, column, countMine, el) {
    let count = 0

    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (isBomb(row + y, column + x)) {
          const r = row + x;
          const c = column + y;
          if (r >= 0 && r < WIDTH - 1 && c >= 0 && c < HEIGHT - 1) {
            count++
          }
        }
      }
    }
    setCountMine(countMine = count)
    return countMine
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
        <div className="game-body" onClick={clickField}>
          {arrItem.map((el, ind) =>
            <button
              className="game-btn"
              style={{
                backgroundImage: 'url(minesweeper-sprites_9TPZzv3.png)',
                //backgroundPosition: !start ? backPos[0] : !explosion ? backPos[10] : selectedButtonId === ind ? backPos[0] : !isBombInd(ind) ? backPos[0] : backPos[9]
                backgroundPosition:
                  !start ? backPos[0] :
                    !explosion ? (!isBombInd(ind) ? backPos[0] : backPos[9]) :
                      isOpenCells(ind) && !isBombInd(ind) ? buttonStates[ind] || backPos[countMine] :
                        (explosion && isBombInd(ind)) ? backPos[9] :
                          (explosion && isOpenCells(ind)) ? buttonStates[ind] :
                            backPos[10]
              }}
              key={ind}
              id={ind}
              disabled={explosion ? true : false}
              onMouseDown={setSmile}
              onMouseUp={setSmile}>
            </button>
          )}
        </div>
      </section >
    </div >
  );

};

export default App;