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
        playsFirst: false,
        preventClicks: false,
      }

    }
    
    componentDidMount() {
      this.startAnimation = () => {
        this.player = document.getElementById('selectPlayer');
        this.player.style.marginTop = '-100px'
        let num = -100;
        
        // animation for selecting player icon
        this.startAnimate = setInterval(() => {
          this.player.style.marginTop = num + 'px';    
          if( this.player.style.marginTop === '0px') { 
            this.player.style.zIndex = '1'; 
            return clearInterval(this.startAnimate);     
          }
          num++;    
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
     // console.log('cdu', this.state)

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
          this.player.style.marginTop = num + 'px';
          if(this.player.style.marginTop === '-100px') return clearInterval(this.endAnimate);
          num--;
        }, 8);
      };
      this.removeAnimation();

      if(this.state.playerWins) setTimeout(this.cpuHandler, 800);
  
    }  

    // manage mouse clicks
    clickHandler(evt) {
      evt.preventDefault();

      if(!this.state.preventClicks) {
        let player = this.state.player;
        
        if( player && !evt.target.innerHTML ) {
          this.id = document.getElementById(evt.target.id);
          this.id.innerHTML = player;
          this.gameLog(player, event.target.id)
          // document.getElementById(evt.target.id).innerHTML = player;
          // makeMove(evt.target, this.state.computer);
        } else if (!player) {
          alert('Select "X" or "O" to start game'); // convert #title header to message board via error function
        } else {
          alert('That space is occupied!');
        }
      }
      
    }

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
          playsFirst: false, // plan to rm from reset or change to variable
          preventClicks: false,
        });
      };

      const evaluateGameStatus = () => {

        setTimeout(this.cpuHandler, 800);
      };


      this.setState({
        preventClicks : this.state.preventClicks ? false : true,
      });
      
      
      this.tilesRemain.splice( this.tilesRemain.indexOf(parseInt(logTileId)), 1);   
      this.recordTiles[logTileId] = logPlayer;

      let playsRemain = this.tilesRemain.length;

      if(!playsRemain) return resetGame();

      if(playsRemain <= 4) {
        evaluateGameStatus();
      } else {
        setTimeout(this.cpuHandler, 800);
      }
      
      console.log(this.recordTiles, this.tilesRemain)
    }

    cpuHandler(suggest) {
      console.log('...waiting for instruction')
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
 
 var player, computer,
 humanLog = [], compLog = [], arr = [],
 human = {}, machine = {},
 winner = false, pause = true;

function resetBoard() {
  //resets the board
  let tiles = document.getElementsByClassName('tile');

  for(let i = 0; i < tiles.length; i++) {
    tiles[i].innerHTML = "";
    //tiles[i].setAttribute('value', '');
    tiles[i].style.cssText += 'color: white; text-shadow: 2px 0 2px lime';
  }

  human = {};
  machine = {};
  humanLog = [];
  compLog = [];
  arr = [];
  winner = false;
  pause = false;
  setTimeout(compPlays, 800);
}

function makeMove(obj, comp) {
  // waits for human input to retract player selection option and prevents playing a square that is already occupied
  player   = obj.innerHTML;
  computer = comp
  pause    = false;
  logPlays();

  if (!winner) setTimeout(compPlays, 800);
}

function logPlays() {
  //scans the board and records the plays for player  
  var playerCount = [];
  for (var i = 1; i < 10; i++) {
    var plays = document.getElementById(i).innerHTML;
    //console.log(plays)
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
        //console.log('complog length', compLog.length)
        if (compLog.length > 2) {
          console.log('sending complog')
          return checkForWin(compLog);
        }
      }
    }
  }
  // console.log({
  //   'playercount' : playerCount,
  //   'human' : human,
  //   'machine' : machine,
  //   'humanlog' : humanLog
  // });
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

function compPlays() {
  //console.log('compPlays')
  var num, list, options = [], score = [];

  const illuminate = function() {
    console.log('illuminate called!')
    //illuminates all the plays if there is a tie
    var tiles = document.getElementsByClassName('tile');
    for (var i = 0; i < tiles.length; i++) {   
      tiles[i].style.cssText = 'color:lime; text-shadow:2px 0 2px white';
      //$("#" + i).css({ color: "lime", textShadow: "2px 0 2px white" });
    }
  };

  //creats a list of the played and unplayed squares
  if (!pause) {
    for (var i = 1; i < 10; i++) {
      list = document.getElementById(i).innerHTML;
      if (list === "") {
        options.push(i);
      } else {
        score.push(i);
      }
    }
    console.log({'options': options, 'score' : score})
    num = compStrategy(score, options);
    pause = true;
    //console.log('num', num, 'computer', computer, 'score.length', score.length)
    //document.getElementById(num).innerHTML = computer;
    //$("#" + num).html(computer);
    //logPlays();
    if (score.length >= 8 && winner === false) {
      illuminate();
      setTimeout(resetBoard, 1000);
    } else {
      document.getElementById(num).innerHTML = computer;
      logPlays();
    }
  }

};

function compStrategy(score, options) {
  var choices = [], num = 0,
  closed = score.length,
  avail  = options.length;

  const random = (range) => {
    var milliseconds = new Date().getMilliseconds();
    return Math.floor(milliseconds * range / 1000);
  };

  const compare = (array) => {
    //compares the rows where there is a possible win

    for (var i = 0; i < array.length; i++) {
      let check = document.getElementById(array[i]).innerHTML;
      if (check === "") {
        arr.unshift(array[i]);
      }

    }

    var square;
    if(arr[0]) square = document.getElementById(arr[0]).innerHTML; 
    return square === "" ? arr[0] : false; 
    //   return arr[0];
    // } else {
    //   return false;
    // }
  };

  const isAThreat = () => {
  //looks for strategic plays that give player advantage
    var pCount = logPlays();
    for (var i = 0; i < pCount.length; i++) {
      for (var j = pCount.length; j > 0; --j) {
        if (
          (pCount[i] == 2 && pCount[j] == 4) ||
          (pCount[i] == 2 && pCount[j] == 7) ||
          (pCount[i] == 3 && pCount[j] == 4)
        ) {
          num = 1;
        }
        if (
          (pCount[i] == 2 && pCount[j] == 6) ||
          (pCount[i] == 1 && pCount[j] == 6) ||
          (pCount[i] == 2 && pCount[j] == 9)
        ) {
          num = 3;
        }
        if (
          (pCount[i] == 4 && pCount[j] == 8) ||
          (pCount[i] == 1 && pCount[j] == 8) ||
          (pCount[i] == 4 && pCount[j] == 9)
        ) {
          num = 7;
        }
        if (
          (pCount[i] == 6 && pCount[j] == 8) ||
          (pCount[i] == 3 && pCount[j] == 8) ||
          (pCount[i] == 6 && pCount[j] == 7)
        ) {
          num = 9;
        }
      }
    }
    if (num !== 0) {
      var square = document.getElementById('5').innerHTML;
      //var square = $("#square" + num).html();
      if (square !== "") {
        num = 5;
      }
      
     // console.log(num, "threat")      
      return num;
    }
    return false;
  };

  const decision = (log) => {
    //looks for win/otherwise blocks player from winning
    let defense = {};
    
    //console.log('decision log', log)
    defense = checkForWin(log);
   
    for (var keys in defense) {     
      if (defense[keys] === 2) {
        var arr = mapBoard(keys);
      //  console.log('keys', keys, 'arr', arr)
        num = compare(arr);
       // console.log('num', num)
      }
    }

    logPlays();
    return num;
  };

  //logical operations for computer to play based on the first few plays
  switch (closed) {
    case 0:
    console.log('case0')
      choices = [1, 3, 7, 9];
      num = random(choices.length);
      return choices[num];
      
    case 1:
    console.log('case1')
      choices = [];
      if (score[0] != 5) {
        return 5;
      } else {
        for (var i = 0; i < avail; i++) {
          if (
            options[i] == 1 ||
            options[i] == 3 ||
            options[i] == 7 ||
            options[i] == 9
          ) {
            choices.push(options[i]);
          }
        }
        num = random(choices.length);
        return choices[num];
      }
      
    case 2:
    console.log('case2')
      num = isAThreat();
      if (!num) {
        num = random(avail);
        return options[num];
      }
      return num;
      
    case 3:
    console.log('case3')
      choices = [];
      num = isAThreat();
      if (!num) {
        num = decision(humanLog);
      }
      if (!num) {
        for (i = 0; i < avail; i++) {
          if (
            options[i] == 2 ||
            options[i] == 4 ||
            options[i] == 6 ||
            options[i] == 8
          ) {
            choices.push(options[i]);
            num = random(choices.length);
          }
        }
        return choices[num];
      }
      return num;
      
    case 4:
    console.log('case4')
      num = decision(compLog);
      if (!num) {
        num = decision(humanLog);
      }
      if (!num) {
        var square = document.getElementById('5').innerHTML;
        //var square = $("#square5").html();
        if (square === "") {
          return 5;
        } else {
          num = random(avail);
        return options[num];
        }
      }
      return num;
      
    default:
    console.log('default')
      num = decision(compLog);
     // console.log('num', num)
      if (!num) {
      //  console.log('nodecision complog', num)
        num = decision(humanLog);
      }
      if (!num) {
      //  console.log('nodecision humanlog', num)
        num = random(avail);
       // console.log(num, options)
        return options[num];
      }
     // console.log('nothing else', num)
      return num;
    
  }

};