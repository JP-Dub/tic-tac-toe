import React, { Component } from 'react';
//import './public/style.css';
//console.log(styles)
//export default ...

// winning combos
const [clone, arr] = [ [],
      [ [1,2,3], [4,5,6], [7,8,9],
        [1,4,7], [2,5,8], [3,6,9],
        [1,5,9], [3,5,7], ],
      ];     

export class App extends Component{
   constructor(props) {
      super(props);

      this.selectPlayer = this.selectPlayer.bind(this);
      this.clickHandler = this.clickHandler.bind(this);
      
      this.state = {
        win        : 0,
        tie        : 0,
        lose       : 0,
        player     : '',
        computer   : '',
        unpauseCpu : false,
        playsFirst : true,
        preventClicks: false,
        message: ''     
      }

    }
    
    componentDidMount() {
      // animation used to display player character selection - called in clickHandler() too
      
      this.startAnimation = () => {
        document.getElementById('scoreboard').classList.add('hideScore');
        // starts selectPlayer behind Title 
        this.player = document.getElementById('selectPlayer');
        this.player.style.marginTop = '-3.55em'
        let size = -3.55;

        // animation for selecting player icon
        this.startAnimate = setInterval(() => {
          this.player.style.marginTop = size.toFixed(2) + 'em';  
          if( size.toFixed(2) >= 0.00) { 
            this.player.style.zIndex = '1'; 
            return clearInterval(this.startAnimate);     
          }
          size += .05;    
        }, 8);
      };
      
      this.startAnimation();
      
      // highlights tiles under mouse cursor
      this.tile = document.getElementById('board');
  
      this.tile.addEventListener('mouseover', (evt) => {
        let id = evt.target.id;
        if(Number(id)) evt.target.style.backgroundColor = "#808080";
      });
  
      this.tile.addEventListener('mouseout', (evt) => {
        let id = evt.target.id;
        if(Number(id)) evt.target.style.backgroundColor = "#666";
      });

      this.board = {};

      this.createBoard = (() => {
        return {
          Board : () => {
            this.board = {
              played : [],
              remain : [1,2,3,4,5,6,7,8,9],
              project: {
                threat : true,
              },
              data: {}
            }
          },
          Init: function() {
            this.Board();
          }
        }
      })();

      this.createBoard.Init();      
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      return this.state
    }
  
    componentWillUnmount() {
      clearInterval(this.startAnimate);
      this.tile.removeEventListener('mouseover');
      this.tile.removeEventListener('mouseout');
    }

    // select 'X' or 'O' to start game
    selectPlayer(icon) {
      icon.preventDefault();
      console.log({'playsFirst': this.state.playsFirst,
                   'preventClicks': this.state.preventClicks})
      //let click = icon.target.innerHTML;

      arr.map( item => clone.push(item.slice()));

      this.setState({
        player   : icon.target.innerHTML,
        computer : icon.target.innerHTML === 'X' ? 'O' : 'X'
      });
      
      // retract selectPlayer Div post icon selection
      let size = 0;
      this.player.style.zIndex = '-1';

      this.endAnimate = setInterval( () => {
        this.player.style.marginTop = size.toFixed(2) + 'em';
        if( size.toFixed(2) <= -3.55) {
          document.getElementById('scoreboard').classList.remove('hideScore');
          return clearInterval(this.endAnimate);
        }
        size -= .05;
      }, 8);     
      
      // used if player loses game computer will go first
      if(!this.state.playsFirst) {
        setTimeout(() => {
          this.cpuHandler();
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
          this.gameHandler(player, parseInt(event.target.id))
        } else if (!player) {
          this.messageHandler('Select "X" or "O" to start game')// move outside of prevent clicks??
          //alert('Select "X" or "O" to start game'); // convert #title header to message board via created error function
        } else {
          this.messageHandler('That space has already been played!')
          //alert('That space has already been played!');
        }
      }
      
    }

    // handle error messages
    messageHandler(msg) {
      console.log(msg)
      let div    = document.getElementById('msg-div'),
          status = document.getElementById('status-messages');
          // //this.divStyle = {'visibility' : 'visible',
          //                   'zIndex': '3'}
          div.classList.add('unhide-msg-div');
          
          this.setState( state => {
            return {message: state.message = msg}
          })
      let opacity = 10;

      let fader = setInterval(() => {
        if(opacity ===  0) {
          div.classList.remove('unhide-msg-div');
          return clearInterval(fader);
        }
        opacity--;
        status.style.opacity = '.' + opacity
        //this.messageStyle = {'opacity': '.' + opacity}
      },200);
    }
    
    // handle cpu and player movements 
    gameHandler(logPlayer, logTileId) {
      let project = this.board.project;
      
      // logPlayer = X or O, logTileId = typeof number 1-9
      const resetGame = (winner) => {
        let clicks = winner ? false: true;
        
        // set tiles to default
        let tiles = document.getElementsByClassName('tile');
        for(let i = 0; i < tiles.length; i++) {
          tiles[i].innerHTML = "";
          tiles[i].classList.remove('flash');
        }
        
        // empty contents of cloned arr
        clone.splice(0);
        
        // activate select player div
        this.startAnimation(); 

        // setState defaults
        this.setState({
          player  : '',
          computer: '',
          unpauseCpu: true,
          playsFirst: winner,
          preventClicks: clicks,
        });
      };

      // clicks are prevented if computer is making the play
      this.setState({
        preventClicks : this.state.preventClicks ? false : true,
      });

      // log played tiles and player - put used tileId in board.played arr - remove tileId from board.remain arr
      this.board.data[logTileId] = logPlayer;
      this.board.played.unshift(logTileId);
      this.board.remain.splice(this.board.remain.indexOf(parseInt(logTileId)), 1); 

      // empty arr contents
      [project.player, project.computer] = [[],[]]

      // cloned array - replace number with player icon and count for strategy or win
      for(let a = 0; a < clone.length; a++) {
        let count = 0, compCount = 0;
        for(let b = 0; b < clone[a].length; b++) {
          if(clone[a][b] === logTileId) clone[a].splice(b, 1, logPlayer);
          if(clone[a][b] === this.state.player  ) count++;
          if(clone[a][b] === this.state.computer) compCount++;
        }
        
        // alerts the game is won - reset board
        if(count === 3 || compCount === 3) {
          let winnerPlaysFirst = this.state.player === logPlayer ? true : false;
          return this.highlightWin(arr[a], () => {
            winnerPlaysFirst ? this.setState( state => {return {win: state.win + 1}}) 
                             : this.setState( state => {return {lose: state.lose + 1}})                         
    
            this.createBoard.Init();
            resetGame(winnerPlaysFirst);
          });         
        }

        // alerts cpu to block
        if(count === 2 && !compCount ) {
           project.player = clone[a];
        }

        // alerts cpu of win
        if(compCount === 2 && ! count) {
          project.computer = clone[a];
        }

      }
      
      // alerts the game is a draw (tie) - reset board
      if(!this.board.remain.length) { 
        this.createBoard.Init();
        
        let first = this.state.playsFirst === true ? false : true;   
        
        return this.highlightTie('on', () => {
          setTimeout(() => {
            this.highlightTie('off');
            this.setState( state => {return {tie: state.tie +1}})
            resetGame(first);
          }, 2000);
          
        });
      }
      
      // pauses cpu loop - wait for player move
      if(this.state.unpauseCpu) {
          setTimeout(() => {
            this.cpuHandler()
          }, 800);
      }

    }

    // highlight all tiles for a tie
    highlightTie(engage, next) {
      for(let i = 1; i < 10; i++) {
        let doc = document.getElementById(i);
        if(engage === 'on') doc.classList.add('flash');
        if(engage === 'off') doc.classList.remove('flash'); 
      }
      if(engage === 'on') return next();
    }

    // flash winning tile column
    highlightWin(combo, next){
      let count = 0;

      let flash = setInterval( () => {
        if(count === 6) {
          clearInterval(flash);
          return next();
        }
        
        for(let i = 0; i < combo.length; i++) {
          let doc = document.getElementById(combo[i]);        
          count % 2 ? doc.classList.add('flash') 
                    : doc.classList.remove('flash');
        }
        count++;
      }, 500);
    }
    
    // handle cpu response to player 
    cpuHandler() {
      const corner   = [1,3,7,9],
            forecast = this.board.project,
            played   = this.board.played,
            remains  = this.board.remain,
            data     = this.board.data
      
      let num = 0;
      
      const random = (range) => {
        let milliseconds = new Date().getMilliseconds();
        return Math.floor(milliseconds * range / 1000);
      };

      const checkDefense = (player) => {
        let win, block;
        
        // look for strategic moves
        const strategy = () => {     
          //looks for strategic plays that give player advantage    
          let isAThreat = [];

          for(let i = 1; i < 10; i++) {
            if(data[i] === player) isAThreat.push(i);
          }          

          for (var i = 0; i < isAThreat.length; i++) {
            for (var j = isAThreat.length-1; j > 0; j--) {
              if (
                (isAThreat[i] === 2 && isAThreat[j] === 4) ||
                (isAThreat[i] === 2 && isAThreat[j] === 7) ||
                (isAThreat[i] === 3 && isAThreat[j] === 4)
              ) { 
                num = 1; }
              
              if (
                (isAThreat[i] === 1 && isAThreat[j] === 6) ||
                (isAThreat[i] === 2 && isAThreat[j] === 6) ||
                (isAThreat[i] === 2 && isAThreat[j] === 9)
              ) { num = 3; }
                    
              if (
                (isAThreat[i] === 1 && isAThreat[j] === 8) ||
                (isAThreat[i] === 4 && isAThreat[j] === 8) ||
                (isAThreat[i] === 4 && isAThreat[j] === 9)
              ) { num = 7; }
              
              if (
                (isAThreat[i] === 3 && isAThreat[j] === 8) ||
                (isAThreat[i] === 6 && isAThreat[j] === 8) ||
                (isAThreat[i] === 6 && isAThreat[j] === 7)
              ) { num = 9; }
            }
          }
          
          return num;
        };  
        
        // analyse the plays and look to win first, defend second
        if(forecast['player'].length || forecast['computer'].length ) {
          var keys = Object.keys(forecast);
         
          for(var i = 0; i < keys.length; i++) {
            for(var j=0; j < forecast[keys[i]].length; j++ ) {
              let value = forecast[keys[i]][j];
              
              if(typeof value === 'number' ) {
                if(keys[i] === 'player') {
                  block = value;
                }
                if(keys[i] === 'computer') {
                  win = value;
                }
              }              
            }
          }
        };     

        console.log('forecast', forecast, win, block)

        if(win) {
          return {
            results : win,
            type: 'win',
          }
        }

        // determin if strategy being set up - will only run once
        if(forecast.threat) { 
          console.log('assess threat')
          forecast.threat = false;
          let threat = strategy();      
          if(threat && !data[threat]) {      
            return { results: threat,
                     type: 'threat'
                   };
          }
        }   

        if(block) {
          return {
            results : block,
            type: 'block'
          }
        }  

        // if all else fails, return random number from remain arr
        return {
          results: remains[random(remains.length)],
          type: 'random',
        };
      };
   
      //logical operations for computer to play based on the first few plays
      switch (played.length) {
        case 0:
          // if cpu starts game  
          console.log('computer first move')      
          num = corner[random(corner.length)];
          break; 

        case 1:
          // if cpu doesn't start game: play corner if 5 is already played
          let temp = [];         
          if(data['5']) {
            for(let i = 2; i < 10; i+=2) {
              if(!data[i]) temp.push(i);
              num = temp[random(temp.length)];
            }
          } else {
            num = 5;
          }
          break;         
          
        default:
          num = checkDefense(this.state.player);         
          break;
      }

      console.log('cpuHandler return', num)   
      
      // num returns both number and object, check for which is being returned
      if(typeof num === 'object') {
        num = num.results;
      }
     
      document.getElementById(num).innerHTML = this.state.computer;
      this.state.unpauseCpu = false;
      this.gameHandler(this.state.computer, num)
    }
    
    render() {
      
      return (
        <ErrorBoundary>
          <div id='title'>
            <h1 id='tic-tac-toe'>Tic Tac Toe</h1>
            <div id='msg-div' className='msg-div-style'><h1 id='status-messages' className='msg-style'>{this.state.message}</h1></div>
          </div>
          <div id='selectPlayer'>
            <p>Please Select "X" or "O"</p>
            <button id="x" onClick={this.selectPlayer}>X</button>
            <span id='addSpace' />
            <button id="o" onClick={this.selectPlayer}>O</button>
            <div id='scoreboard'>
            <div id='w' className='score'>Win:<span id='win'>{this.state.win}</span></div>
            <div id='t' className='score'>Tie:<span id='tie'>{this.state.tie}</span></div>     
            <div id='l' className='score'>Lose:<span id='lose'>{this.state.lose}</span></div>
          </div>
          
         </div> 
         <Gameboard clickHandler={this.clickHandler}/>
        </ErrorBoundary>
        );
    }
}

// Construct gameboard and podium
const Gameboard = (props) => {

   const buildTable = (tableData) => {
     let td = tableData.map( (num, idx) => {
       return (
         <td key   = {idx}
             id    = {num}
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