import './App.css';
import { useRef, useEffect, useState } from "react";

function App() {

  const BOMBS_COUNT = 106;
  const WIDTH = 16;
  const HEIGHT = 16;

  const cellsCount = WIDTH * HEIGHT;
  const arrItem = [...Array(cellsCount)];

  const [start, setStart] = useState(false)
  const [explosion, setExplosion] = useState(false)
  const [timer, setTimer] = useState({ secondOne: -225, secondTwo: -225, secondThree: -225 });
  const [count, setCount] = useState({ countOne: -225, countTwo: -225, countThree: -225 });
  const [countM, setCountM] = useState({ 0: '-28px 48px', 1: '-2px 22px;', 2: '-28px 22px;', 3: '-53px 22px;', 4: '-79px 22px;', 5: '-105px 22px;', 6: '-130px 22px;', 7: '-156px 22px;', 8: '-182px 22px;' });
  const [countMine, setCountMine] = useState(BOMBS_COUNT);
  const [click, setClick] = useState(false);
  const [allBombs, setAllBombs] = useState({})

  //const cells = [...gameBody.current.children]

  useEffect(() => {

  }, [start])

  function startGame() {
    if (!start) {
      setStart(true);
      creteBomb(cellsCount)
    } else {
      timerStop();
    }
  }

  function creteBomb(cellsCount) {
    const bombs = [...Array(cellsCount).keys()]
      .sort(() => Math.random() - 0.5)
      .slice(0, BOMBS_COUNT);
  }

  function clickField(e) {
    if (start) {
      if (e.target.tagName !== 'BUTTON') {
        return;
      }

      const index = e.target.id;
      const column = index % WIDTH;
      const row = Math.floor(index / WIDTH);
      open(row, column, e, countM)

    }
  }

  function open(row, column, e, countM) {
    const index = row * WIDTH + column;
    let num = getCountM(row, column)
    console.log('num ' + num);
    if (!isBomb(row, column)) {
      //e.target.style.borderWidth = '1px';
      //e.target.style.borderColor = '#d4d4d4';
      //e.target.style.borderStyle = 'solid';
      e.target.disabled = true
      e.target.style.backgroundPosition = countM[num];
      console.log(e.target.style.backgroundPosition = countM[num]);
    } else {
      setExplosion(true);
      setStart(false);
      timerStop()
    }

  }


  function isBomb(row, column, bombs) {
    const index = row * WIDTH + column;
    setAllBombs(bombs.includes(index));
    return bombs.includes(index);
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

  function getCountM(row, column) {
    let count = 0
    for (let x = -1; x < 1; x++) {
      for (let y = -1; y < 1; y++) {
        if (isBomb(row + y, column + x)) {
          count++
        }
      }
    }
    return count
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
                  start ? '-50px -44px' :
                    explosion ? '-189px -44px' :
                      countMine == 0 ? '-143px -44px' : '-50px - 44px'
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
                backgroundPosition: !isBomb ? '289px 48px' : explosion ? '54px 48px' : '181px 48px',
                backgroundSize: '210px',
              }}
              key={ind}
              id={ind}
              disabled={start ? false : "disabled"}
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