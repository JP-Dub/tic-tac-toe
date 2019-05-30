import React, { Component } from 'react';
//, { Component }
//export default ...
export class App extends Component{
   constructor(props) {
      super(props);

      this.selectPlayer = this.selectPlayer.bind(this);
      this.clickHandler = this.clickHandler.bind(this);
      
      this.state = {
        player  : '',
        computer: '',
        unpauseCpu: false,
        playsFirst: true, // firstMove, goesFirst, movesFirst, startsFirst, playerStarts, winnerStarts, winnerMovesFirst, winnersFirst
        preventClicks: false,
        
      }

    }
    
    componentDidMount() {
      this.startAnimation = () => {
        // starts selectPlayer behind Title 
        this.player = document.getElementById('selectPlayer');
        this.player.style.marginTop = '-3.55em'
        let num = -3.55;
        
        // animation for selecting player icon
        this.startAnimate = setInterval(() => {
          this.player.style.marginTop = num.toFixed(2) + 'em';  
          if( num.toFixed(2) >= 0.00) { 
            this.player.style.zIndex = '1'; 
            return clearInterval(this.startAnimate);     
          }
          num += .05;    
        }, 8);
      };
      
      this.startAnimation();
      
      // highlights tiles under mouse cursor
      this.board = document.getElementById('board');
  
      this.board.addEventListener('mouseover', (evt) => {
        let id = evt.target.id;
        if(Number(id)) evt.target.style.backgroundColor = "#808080";
      })
  
      this.board.addEventListener('mouseout', (evt) => {
        let id = evt.target.id;
        if(Number(id)) evt.target.style.backgroundColor = "#666";
      })
      
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      return this.state
    }
  
    componentWillUnmount() {
      clearInterval(this.startAnimate);
      this.board.removeEventListener('mouseover');
      this.board.removeEventListener('mouseout');
    }
    
    // select 'X' or 'O' to start game
    selectPlayer(icon) {
      icon.preventDefault();

      let click = icon.target.innerHTML;

      this.recordTiles = {};
      this.tilesRemain = [1,2,3,4,5,6,7,8,9];

      this.setState({
        player   : click,
        computer : click === 'X' ? 'O' : 'X'
      });
      
      this.removeAnimation = () => {
        let num = 0;
        this.player.style.zIndex = '-1';

        this.endAnimate = setInterval( () => {
          this.player.style.marginTop = num.toFixed(2) + 'em';
          if( num.toFixed(2) <= -3.55) return clearInterval(this.endAnimate);
          num -= .05;
        }, 8);
      };
      this.removeAnimation();

      if(!this.state.playsFirst) {
        //this.setState({preventClicks : true}); // validate importance/necessasity
        setTimeout(() => {
          this.cpuHandler(this.recordTiles, this.tilesRemain);
        }, 800);
      } 

    } 

    // handle mouse clicks
    clickHandler(evt) {
      evt.preventDefault();

      if(!this.state.preventClicks) {
        let player = this.state.player;
        
        if( player && !evt.target.innerHTML ) {
          this.id = document.getElementById(evt.target.id);
          this.id.innerHTML = player;
          this.state.unpauseCpu = true;
          this.gameLog(player, event.target.id)
        } else if (!player) {
          alert('Select "X" or "O" to start game'); // convert #title header to message board via error function
        } else {
          alert('That space is occupied!');
        }
      }
      
    }
    
    // handle cpu and player movements
    gameLog(logPlayer, logTileId) {

      const resetGame = () => {
        // set tiles to default
        let tiles = document.getElementsByClassName('tile');

        for(let i = 0; i < tiles.length; i++) {
          tiles[i].innerHTML = "";
          tiles[i].style.cssText += 'color: white; text-shadow: 2px 0 2px lime';
        }

        this.startAnimation(); // allow player to select new icon

        this.setState({
          player  : '',
          computer: '',
          unpauseCpu: true,
          playsFirst: false, // plan to rm from reset or change to variable
          preventClicks: true,
        });
      };

      const evaluateGameStatus = () => {
        console.log('evaluateGameStatus')
        setTimeout( () => {
          this.cpuHandler(this.recordTiles, this.tilesRemain);
        }, 800);
      };


      this.setState({
        preventClicks : this.state.preventClicks ? false : true,
      });
      
      
      this.tilesRemain.splice( this.tilesRemain.indexOf(parseInt(logTileId)), 1);   
      this.recordTiles[logTileId] = logPlayer;

      let playsRemain = this.tilesRemain.length;

      if(!playsRemain) return resetGame();
      
      if(this.state.unpauseCpu) {
        if(playsRemain <= 4) {
          evaluateGameStatus();
        } else {
          setTimeout(() => {
            this.cpuHandler(this.recordTiles, this.tilesRemain)
          }, 800);
        }
      }
      
      //console.log(this.recordTiles, this.tilesRemain)
    }

    // handle cpu response to player 
    cpuHandler(record, remains) {
      let choices = [], num = 0;
      let playedTiles = 9 - remains.length;
      let playerMoves = [];
      console.log('preventClicks = ', this.state.preventClicks)
      console.log('...waiting for instruction')

      const random = (range) => {
        console.log('random')
        var milliseconds = new Date().getMilliseconds();
        return Math.floor(milliseconds * range / 1000);
      };      
      
      const isAThreat = () => {
        //looks for strategic plays that give player advantage         
          Object.keys(record).forEach((key)=> {
            if(record[key] === this.state.player) playerMoves.push(parseInt(key));
          })
          for (var i = 0; i < playerMoves.length; i++) {
            for (var j = playerMoves.length-1; j > 0; j--) {
              console.log(playerMoves[i], playerMoves[j])
              if (
                (playerMoves[i] === 2 && playerMoves[j] === 4) ||
                (playerMoves[i] === 2 && playerMoves[j] === 7) ||
                (playerMoves[i] === 3 && playerMoves[j] === 4)
              ) {
                num = 1;
              }
              if (
                (playerMoves[i] === 2 && playerMoves[j] === 6) ||
                (playerMoves[i] === 1 && playerMoves[j] === 6) ||
                (playerMoves[i] === 2 && playerMoves[j] === 9)
              ) {
                num = 3;
              }
              if (
                (playerMoves[i] === 4 && playerMoves[j] === 8) ||
                (playerMoves[i] === 1 && playerMoves[j] === 8) ||
                (playerMoves[i] === 4 && playerMoves[j] === 9)
              ) {
                num = 7;
              }
              if (
                (playerMoves[i] === 6 && playerMoves[j] === 8) ||
                (playerMoves[i] === 3 && playerMoves[j] === 8) ||
                (playerMoves[i] === 6 && playerMoves[j] === 7)
              ) {
                num = 9;
              }
            }
          }
          console.log('isAthreat ', num)
          // if (num) {
          //   console.log('returning ', num)
          //   return record['5'] ? num : 5;
          // }
          // return false;
          return num ? record['5'] ? num : 5 : false;
      };
           
      console.log(playedTiles, 'playedTiles')
      //logical operations for computer to play based on the first few plays
      switch (playedTiles) {
        case 0:
          // if cpu starts game
          choices = [1, 3, 7, 9];
          num = choices[random(choices.length)];
          break; 
        case 1:
          // if cpu doesn't start game: play corner if 5 is played
          let isNotFive = false;          
          for(let i = 0; i < remains.length; i++) {
            // if(remains[i] === 5) {
            //   isNotFive = true;
            // } else
            if (
              remains[i] === 1 ||
              remains[i] === 3 ||
              remains[i] === 7 ||
              remains[i] === 9
            ) {
              choices.push(remains[i]);
            }
          }
          //num = isNotFive ? 5 : choices[random(choices.length)];
          num = !record['5'] ? 5 : choices[random(choices.length)];
          break;         
          
        case 2:
          console.log('case2')
          num = isAThreat();
          if (!num) num = remains[random(remains.length)];            
          break;
          
        case 3:  
          num = isAThreat() ? num : checkDefense(record, this.state.player);
          //if(!num.length) num = remains[random(remains.length)];

          // if(typeof num === 'string') {
          //   for(let i = 2; i < 10; i += 2) {
          //     if(!record[i]) choices.push(i);
          //     num = choices[random(choices.length)];
          //   }
          // }         
          break;
          
        case 4:
          console.log('case4')
          num = checkDefense(record, this.state.computer);
          if(!num) num = checkDefense(record, this.state.player);

          if (!num) {
            //var square = document.getElementById('5').innerHTML;
            num =  !record['5'] ? 5 : remains[random(remains.length)];
          }
          break;
          
        default:
         console.log('default')
          num = checkDefense(record, this.state.computer);
        
          if(!num[0]) {         
            num = checkDefense(record, this.state.player);
          } 
          
          if(!num[0]) {
            console.log('random number', num, remains)
            num = remains[random(remains.length)];

          }
          break;
      }

      console.log(num, typeof num)
      
      if(typeof num === 'string') {
        for(let i = 2; i < 10; i += 2) {
          if(!record[i]) choices.push(i);
          num = choices[random(choices.length)];
          if(!num) num = remains[random(remains.length)];
        }
      }   
            
      document.getElementById( num.length? num[0]: num).innerHTML = this.state.computer;
      this.state.unpauseCpu = false;
      this.gameLog(this.state.computer, num)
    }
    
    render() {
      return (
        <ErrorBoundary>
          <div id='title'>
            <h1>Tic Tac Toe</h1>
          </div>
          <div id='selectPlayer'>
            <p>Please Select "X" or "O"</p>
            <button id="x" onClick={this.selectPlayer}>X</button>
            <span id='addSpace' />
            <button id="o" onClick={this.selectPlayer}>O</button>     
          </div> 
         <Gameboard clickHandler={this.clickHandler}/>
        </ErrorBoundary>
        );
    }
}

  // Construct gameboard and podium
const Gameboard = (props) => {

   const buildTable = (arr) => {
     let td = arr.map( (num, idx) => {
       return (
         <td key   = {idx}
             id    = {num}
             value = ''
             className = 'tile'
             onClick   = {props.clickHandler} />
       );
     });
     
     return  <tr>{td}</tr>;   
   }
   
   return(
     <ErrorBoundary>
       <div id='background'>
         <table id='board'>
           <tbody>
             {buildTable(['1', '2', '3'])}
             {buildTable(['4', '5', '6'])}
             {buildTable(['7', '8', '9'])}
           </tbody>
         </table>           
       </div>
     </ErrorBoundary>
    );
}
 
   // Error class React Component
class ErrorBoundary extends React.Component {
   constructor(props) {
     super(props);
       this.state = { hasError: false };
   }
 
   static getDerivedStateFromError(error) {
     // Update state so the next render will show the fallback UI.
     return { hasError: true };
   }
 
   componentDidCatch(error, info) {
     // Display fallback UI -- to be deprecated in future release
     this.setState({ hasError: true });
     
     logComponentStackToMyService(info.componentStack);
     // log the error to console 
     console.log(error, info);   
   }
     
   render() {
     if (this.state.hasError) {
       // You can render any custom fallback UI
       return <h3>Mission Control...we have an error.</h3>;
     }
     return this.props.children;
   };
}; 

const checkDefense = (record, player) => {
  console.log('checkDefense', record, player)
  const arr = [[1,2,3], [4,5,6], [7,8,9], // horizontal wins
               [1,4,7], [2,5,8], [3,6,9], // vertical wins
               [1,5,9], [3,5,7]           // diagonal wins
              ];

  // let defense = [],
  //     moves   = [],        
  //     clone   = [];
  let [defense, moves, clone] = [[],[],[]];            

  arr.forEach( item => clone.push(item.slice()));
  
  for(var key in record) {
    if(record[key] === player) moves.push(parseInt(key))
  }
  
  for(var i = 0; i < clone.length; i++) {
    var count = 0;
    for(var j = 0; j < clone[i].length; j++) {
      for(var k = 0; k < moves.length; k++) {
        if(clone[i][j] === moves[k]) {
          count++;
          clone[i].splice(j, 1);
        }
      }
    }

    if(count===3) return arr[i];
    if(count===2) {
      if(!record[clone[i][0]]) {
        defense.push(clone[i][0]);
      } else if(i === 6 || i === 7) return 'strategy';
    }
  }
  
  return defense;
};

 
 var player, computer,
 humanLog = [], compLog = [], arr = [],
 human = {}, machine = {},
 winner = false, pause = true;

// function resetBoard() {
//   //resets the board
//   let tiles = document.getElementsByClassName('tile');

//   for(let i = 0; i < tiles.length; i++) {
//     tiles[i].innerHTML = "";
//     tiles[i].style.cssText += 'color: white; text-shadow: 2px 0 2px lime';
//   }

//   human = {};
//   machine = {};
//   humanLog = [];
//   compLog = [];
//   arr = [];
//   winner = false;
//   pause = false;
//   setTimeout(compPlays, 800);
// }

// function makeMove(obj, comp) {
//   // waits for human input to retract player selection option and prevents playing a square that is already occupied
//   player   = obj.innerHTML;
//   computer = comp
//   pause    = false;
//   logPlays();

//   if (!winner) setTimeout(compPlays, 800);
// }

function logPlays() {
  //scans the board and records the plays for player  
  var playerCount = [];
  for (var i = 1; i < 10; i++) {
    var plays = document.getElementById(i).innerHTML;

    if (plays !== "") {
      if (plays === player) {
        human['square' + i] = plays;
        playerCount.push(i);
        humanLog = Object.keys(human);

        if (humanLog.length > 2) {
          console.log('sending humanlog')
          return checkForWin(humanLog);
        }
      } else {
        machine["square" + i] = plays;
        compLog = Object.keys(machine);
       
        if (compLog.length > 2) {
          console.log('sending complog')
          return checkForWin(compLog);
        }
      }
    }
  }

  return playerCount;
}

function checkForWin(log) {
  //console.log('checkforwin', log)
  //the log is the human or machine array
  var highlight;

  const showWin = (lights) => {
    //illuminates the winning row
    for (var i = 0; i < lights.length; i++) {
      document.getElementById(lights[i]).style.cssText = 'color:lime; text-shadow: 2px 0 2px white';
    }
  };

  let play = {
    //score board for each player
    top: 0, middle: 0, bottom: 0,
    left: 0, center: 0, right: 0,
    upperDiag: 0, lowerDiag: 0
  };

  for (var i = 0; i < log.length; i++) {
    //console.log('log', log)
    switch (log[i]) {
      case "square1":
        play.top += 1;
        play.left += 1;
        play.upperDiag += 1;
        break;
      case "square2":
        play.top += 1;
        play.center += 1;
        break;
      case "square3":
        play.top += 1;
        play.right += 1;
        play.lowerDiag += 1;
        break;
      case "square4":
        play.middle += 1;
        play.left += 1;
        break;
      case "square5":
        play.middle += 1;
        play.center += 1;
        play.lowerDiag += 1;
        play.upperDiag += 1;
        break;
      case "square6":
        play.middle += 1;
        play.right += 1;
        break;
      case "square7":
        play.bottom += 1;
        play.left += 1;
        play.lowerDiag += 1;
        break;
      case "square8":
        play.bottom += 1;
        play.center += 1;
        break;
      case "square9":
        play.bottom += 1;
        play.right += 1;
        play.upperDiag += 1;
        break;
    };
  }
  //console.log('play', play)

  for (var key in play) {
  //looks to see if the play results in 3 points
    
    if (play[key] === 3) {
      winner = true;
      highlight = mapBoard(key);
      showWin(highlight);
      setTimeout(resetBoard, 1000);
    } 
  }

  return play;
}

function mapBoard(keys) {
  //function is used by compStrategy() and checkForWin()
  var map;
  switch (keys) {
    case "top":
      map = [1, 2, 3];
      break;
    case "middle":
      map = [4, 5, 6];
      break;
    case "bottom":
      map = [7, 8, 9];
      break;
    case "left":
      map = [1, 4, 7];
      break;
    case "center":
      map = [2, 5, 8];
      break;
    case "right":
      map = [3, 6, 9];
      break;
    case "upperDiag":
      map = [1, 5, 9];
      break;
    case "lowerDiag":
      map = [3, 5, 7];
      break;
  }

  return map;
}