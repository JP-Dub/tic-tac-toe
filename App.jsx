import React, { Component } from 'react';
//export default ...

// winning combos
const arr = [
      [1,2,3], [4,5,6], [7,8,9],
      [1,4,7], [2,5,8], [3,6,9],
      [1,5,9], [3,5,7] 
      ];

let copy = [];
      

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
        prevThreat: false, // isn't used      
      }

    }
    
    componentDidMount() {
      // animation used to display player character selection - called in clickHandler() too
      this.startAnimation = () => {
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
      })
  
      this.tile.addEventListener('mouseout', (evt) => {
        let id = evt.target.id;
        if(Number(id)) evt.target.style.backgroundColor = "#666";
      })

      this.board = {};

      this.createBoard = (() => {
        return {
          Board : () => {
            this.board = {
              played : [],
              remain : [1,2,3,4,5,6,7,8,9],
              project: {},
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
      
      let click = icon.target.innerHTML;

      this.recordTiles = {};
      this.tilesRemain = [1,2,3,4,5,6,7,8,9];

      //this.board = {};

      // this.createBoard = (() => {
      //   return {
      //     Board : () => {
      //       this.board = {
      //         played : [],
      //         remain : [1,2,3,4,5,6,7,8,9],
      //         project: {},
      //         data: {}
      //       }
      //     },
      //     Init: function() {
      //       this.Board();
      //     }
      //   }
      // })();
      // this.createBoard.Init();      
      //this.createBoard.Init();
      //console.log(this.board)

      arr.map( item => copy.push(item.slice()));

      this.setState({
        player   : click,
        computer : click === 'X' ? 'O' : 'X'
      });
      
      this.removeAnimation = () => {
        let size = 0;
        this.player.style.zIndex = '-1';

        this.endAnimate = setInterval( () => {
          this.player.style.marginTop = size.toFixed(2) + 'em';
          if( size.toFixed(2) <= -3.55) return clearInterval(this.endAnimate);
          size -= .05;
        }, 8);
      };

      this.removeAnimation(); // only place this function is used consider removing
      
      // used if player loses game computer will go first
      if(!this.state.playsFirst) {
        //this.setState({preventClicks : true}); // validate importance/necessasity
        setTimeout(() => {
          this.cpuHandler(this.recordTiles, 0);
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
          this.gameLog(player, parseInt(event.target.id))
        } else if (!player) {
          alert('Select "X" or "O" to start game'); // convert #title header to message board via created error function
        } else {
          alert('That space has already been played!');
        }
      }
      
    }
    
    // handle cpu and player movements consider changing to gameCPU
    gameLog(logPlayer, logTileId) {
      // logPlayer = X or O, logTileId = typeof number 1-9
      const resetGame = () => {
        
        // set tiles to default
        let tiles = document.getElementsByClassName('tile');
        for(let i = 0; i < tiles.length; i++) {
          tiles[i].innerHTML = "";
          tiles[i].classList.remove('flash');
        }
        
        // empty contents of copied arr
        copy.splice(0);
        
        // activate select player div
        this.startAnimation(); 

        // setState defaults
        this.setState({
          player  : '',
          computer: '',
          unpauseCpu: true,
          playsFirst: false, // plan to rm from reset or change to variable
          preventClicks: true,
        });
      };

      // ?? verify player clicks are prevented if computer is going first
      this.setState({
        preventClicks : this.state.preventClicks ? false : true,
      });
           
      // remove selected tile number and add to recordTiles Object
      this.tilesRemain.splice( this.tilesRemain.indexOf(parseInt(logTileId)), 1);   
      this.recordTiles[logTileId] = logPlayer;

      // acquire new length of remaining tile array
      let playsRemain = this.tilesRemain.length;

      this.board.data[logTileId] = logPlayer;
      this.board.played.push(logTileId);
      this.board.remain.splice(this.board.remain.indexOf(parseInt(logTileId)), 1); 

      // cloned array - replace number with player icon and count for strategy or win
      for(let a = 0; a < copy.length; a++) {
        let count = 0, compCount = 0;
        for(let b = 0; b < copy[a].length; b++) {
          if(copy[a][b] === logTileId) copy[a].splice(b, 1, logPlayer);
          if(copy[a][b] === this.state.player) count++;
          if(copy[a][b] === this.state.computer) compCount++;
        }

        // alerts a win
        if(count === 3 || compCount === 3) {
          return this.flashTiles(arr[a], () => {
            resetGame();
          });         
        }
        // alerts player to possible win
        if(count === 2 ) {
          if(!compCount)  this.board.project['player'] = copy[a];
        }

        // alerts computer to possible win
        if(compCount === 2) {
          if(!count) this.board.project['computer'] = copy[a];
        }

      }
      console.log('gameLog', this.board)
      // alert for no plays left - reset board
      if(!this.board.remain.length) { 
        this.createBoard.Init()      
        return this.flashTiles(this.board.remain, () => {
          resetGame();
        })
      }
      
      // pauses cpu loop - wait for player move
      if(this.state.unpauseCpu) {
          setTimeout(() => {
            this.cpuHandler(this.recordTiles, (9 - this.board.remain.length))
          }, 800);
      }

    }

    flashTiles(total, next){
      let count = 0, length;

      let flash = setInterval( () => {
        if(count === 6) {
          clearInterval(flash);
          return next();
        }
        
        for(let i = 0; i < total.length; i++) {
          let doc = document.getElementById(total[i]);        
          count % 2 ? doc.classList.add('flash') 
                    : doc.classList.remove('flash');
        }
        count++;
      }, 500);
    }
    
    // handle cpu response to player 
    cpuHandler(record, playedTiles) {
      
      const [corner, side]   = [[1,3,7,9], [2,4,6,8]],
            [clone, choices] = [[],[]];
      
      let forecast = this.board.project
      
      let offense = true,
          num     = 0;
      
      const random = (range) => {
        let milliseconds = new Date().getMilliseconds();
        return Math.floor(milliseconds * range / 1000);
      };
      console.log('record', record, playedTiles, 'playedTiels')
      console.log('board' , this.board)
      const checkDefense = (record, player) => {
        const [defense, altDefense, played, unplayed] = [[], [], [], []];
        let threat;
        console.log('board' , this.board)
        // make a clone of the arr
        arr.map( item => clone.push(item.slice()));
        
        // look for strategic moves
        const strategy = (isAThreat) => {     
          //looks for strategic plays that give player advantage    
          let num;
      
          for (var i = 0; i < isAThreat.length; i++) {
            for (var j = isAThreat.length-1; j > 0; j--) {
              if (
                (isAThreat[i] === 2 && isAThreat[j] === 4) ||
                (isAThreat[i] === 2 && isAThreat[j] === 7) ||
                (isAThreat[i] === 3 && isAThreat[j] === 4)
              ) { 
                num = 1; }
              
              if (
                (isAThreat[i] === 2 && isAThreat[j] === 6) ||
                (isAThreat[i] === 1 && isAThreat[j] === 6) ||
                (isAThreat[i] === 2 && isAThreat[j] === 9)
              ) { num = 3; }
                    
              if (
                (isAThreat[i] === 4 && isAThreat[j] === 8) ||
                (isAThreat[i] === 1 && isAThreat[j] === 8) ||
                (isAThreat[i] === 4 && isAThreat[j] === 9)
              ) { num = 7; }
              
              if (
                (isAThreat[i] === 6 && isAThreat[j] === 8) ||
                (isAThreat[i] === 3 && isAThreat[j] === 8) ||
                (isAThreat[i] === 6 && isAThreat[j] === 7)
              ) { num = 9; }
            }
          }
          
          return num;
        };  
        
        // create two arrays for moves played and moves remaining
        for(let i = 1; i < 10; i++) {
          if(record[i] === player) played.push(i);
          if(!record[i]) unplayed.push(i);
        }

        // run function to determin if strategy being set up
        if(playedTiles < 5) { 
          threat = strategy(played);      
          if(threat) {        
            if(!record[threat]) return { results: threat,
                                         offense: offense,
                                         type: 'threat'
                                        };
          }
        }
       
        if(forecast['player'] || forecast['computer'] ) {
          var keys = Object.keys(forecast);
         
          for(var i = 0; i < keys.length; i++) {
            for(var j=0; j < forecast[keys[i]].length; j++ ) {
              num = forecast[keys[i]][j];
              
              if(typeof num === 'number' ) {
                if(keys[i] === 'player') {
                  forecast['block'] = num;
                }
                if(keys[i] === 'computer') {
                  forecast['win'] = num;
                }
              }              
            }
          }
        };

        console.log('forecast', forecast)
        if(forecast.win) {
          return {
            results : forecast.win,
            type: 'win',
          }
        }

        if(forecast.block) {
          return {
            results : forecast.block,
            type: 'block'
          }
        }

        return {
          results: unplayed[random(unplayed.length)],
          offense: offense,
          type: 'random',
        };
      };
   
      //logical operations for computer to play based on the first few plays
      switch (playedTiles) {
        case 0:
          // if cpu starts game  
          console.log('computer first move')      
          num = corner[random(corner.length)];
          break; 

        case 1:
          // if cpu doesn't start game: play corner if 5 is already played
          let temp = [];         
          if(record['5']) {
            for(let i = 0; i < corner.length; i++) {
              if(!record[i]) temp.push(corner[i]);
              num = temp[random(temp.length)];
            }
          } else {
            num = 5;
          }
          break;         
          
        default:
          num = checkDefense(record, this.state.player);         
          break;
      }

      console.log('num', num)
      if(typeof num === 'object') {
        num = num.results;
      }
         
      document.getElementById(num).innerHTML = this.state.computer;
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





// const checkDefense = (record, player) => {
//   const [defense, altDefense, played, unplayed] = [[], [], [], []];
//   let threat;
//   // make a clone of the arr
//   arr.map( item => clone.push(item.slice()));
  
//   // look for strategic moves
//   const strategy = (isAThreat) => {     
//     //looks for strategic plays that give player advantage    
//     let num;

//     for (var i = 0; i < isAThreat.length; i++) {
//       for (var j = isAThreat.length-1; j > 0; j--) {
//         if (
//           (isAThreat[i] === 2 && isAThreat[j] === 4) ||
//           (isAThreat[i] === 2 && isAThreat[j] === 7) ||
//           (isAThreat[i] === 3 && isAThreat[j] === 4)
//         ) { 
//           num = 1; }
        
//         if (
//           (isAThreat[i] === 2 && isAThreat[j] === 6) ||
//           (isAThreat[i] === 1 && isAThreat[j] === 6) ||
//           (isAThreat[i] === 2 && isAThreat[j] === 9)
//         ) { num = 3; }
              
//         if (
//           (isAThreat[i] === 4 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 1 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 4 && isAThreat[j] === 9)
//         ) { num = 7; }
        
//         if (
//           (isAThreat[i] === 6 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 3 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 6 && isAThreat[j] === 7)
//         ) { num = 9; }
//       }
//     }
    
//     return num;
//   };  
  
//   // create two arrays for moves played and moves remaining
//   for(let i = 1; i < 10; i++) {
//     if(record[i] === player) played.push(i);
//     if(!record[i]) unplayed.push(i);
//   }

//   // run function to determin if strategy being set up
//   if(playedTiles < 5) { 
//     threat = strategy(played);      
//     if(threat) {        
//       //console.log('...threat found, ', threat)
//       if(!record[threat]) return { results: threat,
//                                    offense: offense,
//                                    type: 'threat'
//                                   };
//     }
//   }

//   //console.log('...no threat found, continue searching...')
  
//   // access winning combos and returns a possible move.
//   for(var i = 0; i < clone.length; i++) {
//     var count = 0;         
//     for(var j = 0; j < clone[i].length; j++) {           
//       for(var k = 0; k < played.length; k++) {
//         if(clone[i][j] === played[k]) {
//           count++;
//           clone[i].splice(j, 1);
          
//         }
//       }
//     }    

//     if(count===3) return { type: 'win', results: arr[i] };

//     if(count===2) {
//       if(!record[clone[i][0]]) { 
//         defense.push(clone[i][0]);
//         clone[i].splice(0, 1);
        
//         return {
//           results: defense[0],
//           offense: offense,
//           type: 'strategy',
//           player: player
//         };
//       }  
      
//       if(i === 6 || i === 7 ) {        
//         for(let i = 2; i < 10; i += 2) {
//           if(!record[i]) altDefense.push(i);
//         }           
//       } 
//     } 
//   }

//   if(altDefense[0]){
//     //console.log('...diag strategy found, ', altDefense)
//     return {
//       results: altDefense[random(altDefense.length)],
//       offense: offense,
//       type: 'diag strategy',
//       player: player
//     };
//   }
  
//   //console.log('...no defense found')
//   if(offense) {
//     offense = false;
//     clone.splice(0);
//     player = (player === 'X') ? 'O' : 'X';
//     //console.log('...searching ofensive move')
//     return checkDefense(record, player);
//   } 

//   //console.log('...no move found, plugging random, ', unplayed)
//   return {
//     results: unplayed[random(unplayed.length)],
//     offense: offense,
//     type: 'random',
//     player: player
//   };
// };

// const flashTiles = (total, next) => {
//   let count = 0;
//   let flash = setInterval( () => {
//     console.log('interval set')
//     if(count === 6) {
//       clearInterval(flash);
//       next();
//     }
//     for(let i = 1; i < total; i++) {
//       console.log(i, ' = 1')
//       let doc = document.getElementById(i)
//       count % 2 ? doc.classList.add('flash') 
//                 : doc.classList.remove('flash');
//     }
//     count++;
//   }, 500);
// }


// const random = (range) => {
//   let milliseconds = new Date().getMilliseconds();
//   return Math.floor(milliseconds * range / 1000);
// };

// function checkDefense(record, player) {
//   let offense = true, previousThreat = false;
//   const [defense, played, unplayed] = [[], [], []];
//   //const [corner, side] = [[1,3,7,9], [2,4,6,8]];
  
//   // const random = (range) => {
//   //   let milliseconds = new Date().getMilliseconds();
//   //   return Math.floor(milliseconds * range / 1000);
//   // };

//   const strategy = (isAThreat) => {     
//     //looks for strategic plays that give player advantage    
//     let num;

//     for (var i = 0; i < isAThreat.length; i++) {
//       for (var j = isAThreat.length-1; j > 0; j--) {
//         if (
//           (isAThreat[i] === 2 && isAThreat[j] === 4) ||
//           (isAThreat[i] === 2 && isAThreat[j] === 7) ||
//           (isAThreat[i] === 3 && isAThreat[j] === 4)
//         ) { 
//           num = 1; }
        
//         if (
//           (isAThreat[i] === 2 && isAThreat[j] === 6) ||
//           (isAThreat[i] === 1 && isAThreat[j] === 6) ||
//           (isAThreat[i] === 2 && isAThreat[j] === 9)
//         ) { num = 3; }
              
//         if (
//           (isAThreat[i] === 4 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 1 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 4 && isAThreat[j] === 9)
//         ) { num = 7; }
        
//         if (
//           (isAThreat[i] === 6 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 3 && isAThreat[j] === 8) ||
//           (isAThreat[i] === 6 && isAThreat[j] === 7)
//         ) { num = 9; }
//       }
//     }

//     if(num && !record[num]) previousThreat = true;
//     return num;
//   };  

//   // create two arrays for moves played and moves remaining
//   for(var key in record) {
//     if(record[key] === player) played.push(parseInt(key)); 
//     if(!record[key]) unplayed.push(parseInt(key));
//   }
  
//   // run function to determin if strategy being set up
//   let threat = strategy(played);
//   if(threat && !previousThreat) {
//     console.log('...threat found, ', threat)
//     if(!record[threat]) return {results: threat,
//                                 offense: offense,
//                                 type: 'threat'};
//   }
//   console.log('...no threat found, ', threat)
  
//   // access winning combos and returns a possible move.
//   for(var i = 0; i < clone.length; i++) {
//     var count = 0;
//     for(var j = 0; j < clone[i].length; j++) {
//       for(var k = 0; k < played.length; k++) {
//         if(clone[i][j] === played[k]) {
//           count++;
//           clone[i].splice(j, 1);
//         }
//       }
//     }    
//     if(count===3) return {results: 'win',
//                           numbers: arr[i]};
//     if(count===2) {
//       if(!record[clone[i][0]]) { // push value left in arr
//         defense.push(clone[i][0]);
//         clone[i].splice(0, 1);
//         return {results: defense[0],
//                 offense: offense,
//                 type: 'strategy'};
//       }  
      
//       if(i === 6 || i === 7 ) {        
//         for(let i = 2; i < 10; i += 2) {
//           if(!record[i]) defense.push(i)
//         }
//         console.log('...diag strategy found, ', defense)
//         return {results: defense[random(defense.length)],
//                 offense: offense,
//                 type: 'diag strategy'};
//       } 
//     } 
//   }
  
//   console.log('...no offense found', defense)
//   if(offense && defense) {
//     offense = false;
//     defense = false;
//     console.log('...searching defensive move')
//     player = player === 'X' ? 'O' : 'X';
//     checkDefense(record, player);
//   } 
//   console.log('...no move found, plugging random, ', unplayed)
//   return {results: unplayed[random(unplayed.length)],
//          offense: offense,
//          type: 'random'};
// };



      // const random = (range) => {
      //   console.log('random')
      //   var milliseconds = new Date().getMilliseconds();
      //   return Math.floor(milliseconds * range / 1000);
      // };      
      
      // const isAThreat = () => {
      //   //looks for strategic plays that give player advantage         
      //     Object.keys(record).forEach((key)=> {
      //       if(record[key] === this.state.player) isAThreat.push(parseInt(key));
      //     })
      //     for (var i = 0; i < isAThreat.length; i++) {
      //       for (var j = isAThreat.length-1; j > 0; j--) {
      //         console.log(isAThreat[i], isAThreat[j])
      //         if (
      //           (isAThreat[i] === 2 && isAThreat[j] === 4) ||
      //           (isAThreat[i] === 2 && isAThreat[j] === 7) ||
      //           (isAThreat[i] === 3 && isAThreat[j] === 4)
      //         ) {
      //           num = 1;
      //         }
      //         if (
      //           (isAThreat[i] === 2 && isAThreat[j] === 6) ||
      //           (isAThreat[i] === 1 && isAThreat[j] === 6) ||
      //           (isAThreat[i] === 2 && isAThreat[j] === 9)
      //         ) {
      //           num = 3;
      //         }
      //         if (
      //           (isAThreat[i] === 4 && isAThreat[j] === 8) ||
      //           (isAThreat[i] === 1 && isAThreat[j] === 8) ||
      //           (isAThreat[i] === 4 && isAThreat[j] === 9)
      //         ) {
      //           num = 7;
      //         }
      //         if (
      //           (isAThreat[i] === 6 && isAThreat[j] === 8) ||
      //           (isAThreat[i] === 3 && isAThreat[j] === 8) ||
      //           (isAThreat[i] === 6 && isAThreat[j] === 7)
      //         ) {
      //           num = 9;
      //         }
      //       }
      //     }
      //     console.log('isAthreat ', num)
      //     // if (num) {
      //     //   console.log('returning ', num)
      //     //   return record['5'] ? num : 5;
      //     // }
      //     // return false;
      //     return num ? record['5'] ? num : 5 : false;
      // };








// const checkDefense = (record, player) => {
//   console.log('checkDefense', record, player)
//   const arr = [
//     [1,2,3], [4,5,6], [7,8,9], // horizontal wins
//     [1,4,7], [2,5,8], [3,6,9], // vertical wins
//     [1,5,9], [3,5,7]           // diagonal wins
//     ];

//   // let defense = [],
//   //     moves   = [],        
//   //     clone   = [];
//   let [defense, moves, clone] = [[],[],[]];            

//   arr.forEach( item => clone.push(item.slice()));
  
//   for(var key in record) {
//     if(record[key] === player) moves.push(parseInt(key))
//   }
  
//   for(var i = 0; i < clone.length; i++) {
//     var count = 0;
//     for(var j = 0; j < clone[i].length; j++) {
//       for(var k = 0; k < moves.length; k++) {
//         if(clone[i][j] === moves[k]) {
//           count++;
//           clone[i].splice(j, 1);
//         }
//       }
//     }

//     if(count===3) return arr[i];
//     if(count===2) {
//       if(!record[clone[i][0]]) {
//         defense.push(clone[i][0]);
//       } else if(i === 6 || i === 7) return 'strategy';
//     }
//   }
  
//   return defense;
// };

 
//  var player, computer,
//  humanLog = [], compLog = [], arr = [],
//  human = {}, machine = {},
//  winner = false, pause = true;

// function logPlays() {
//   //scans the board and records the plays for player  
//   var playerCount = [];
//   for (var i = 1; i < 10; i++) {
//     var plays = document.getElementById(i).innerHTML;

//     if (plays !== "") {
//       if (plays === player) {
//         human['square' + i] = plays;
//         playerCount.push(i);
//         humanLog = Object.keys(human);

//         if (humanLog.length > 2) {
//           console.log('sending humanlog')
//           return checkForWin(humanLog);
//         }
//       } else {
//         machine["square" + i] = plays;
//         compLog = Object.keys(machine);
       
//         if (compLog.length > 2) {
//           console.log('sending complog')
//           return checkForWin(compLog);
//         }
//       }
//     }
//   }

//   return playerCount;
// }

// function checkForWin(log) {
//   //console.log('checkforwin', log)
//   //the log is the human or machine array
//   var highlight;

//   const showWin = (lights) => {
//     //illuminates the winning row
//     for (var i = 0; i < lights.length; i++) {
//       document.getElementById(lights[i]).style.cssText = 'color:lime; text-shadow: 2px 0 2px white';
//     }
//   };

//   let play = {
//     //score board for each player
//     top: 0, middle: 0, bottom: 0,
//     left: 0, center: 0, right: 0,
//     upperDiag: 0, lowerDiag: 0
//   };

//   for (var i = 0; i < log.length; i++) {
//     //console.log('log', log)
//     switch (log[i]) {
//       case "square1":
//         play.top += 1;
//         play.left += 1;
//         play.upperDiag += 1;
//         break;
//       case "square2":
//         play.top += 1;
//         play.center += 1;
//         break;
//       case "square3":
//         play.top += 1;
//         play.right += 1;
//         play.lowerDiag += 1;
//         break;
//       case "square4":
//         play.middle += 1;
//         play.left += 1;
//         break;
//       case "square5":
//         play.middle += 1;
//         play.center += 1;
//         play.lowerDiag += 1;
//         play.upperDiag += 1;
//         break;
//       case "square6":
//         play.middle += 1;
//         play.right += 1;
//         break;
//       case "square7":
//         play.bottom += 1;
//         play.left += 1;
//         play.lowerDiag += 1;
//         break;
//       case "square8":
//         play.bottom += 1;
//         play.center += 1;
//         break;
//       case "square9":
//         play.bottom += 1;
//         play.right += 1;
//         play.upperDiag += 1;
//         break;
//     };
//   }
//   //console.log('play', play)

//   for (var key in play) {
//   //looks to see if the play results in 3 points
    
//     if (play[key] === 3) {
//       winner = true;
//       highlight = mapBoard(key);
//       showWin(highlight);
//       setTimeout(resetBoard, 1000);
//     } 
//   }

//   return play;
// }

// function mapBoard(keys) {
//   //function is used by compStrategy() and checkForWin()
//   var map;
//   switch (keys) {
//     case "top":
//       map = [1, 2, 3];
//       break;
//     case "middle":
//       map = [4, 5, 6];
//       break;
//     case "bottom":
//       map = [7, 8, 9];
//       break;
//     case "left":
//       map = [1, 4, 7];
//       break;
//     case "center":
//       map = [2, 5, 8];
//       break;
//     case "right":
//       map = [3, 6, 9];
//       break;
//     case "upperDiag":
//       map = [1, 5, 9];
//       break;
//     case "lowerDiag":
//       map = [3, 5, 7];
//       break;
//   }

//   return map;
// }

/*
      switch (playedTiles) {
        case 0:
          // if cpu starts game
          choices = [1, 3, 7, 9];
          num = choices[random(choices.length)];
          break; 
        case 1:
          // if cpu doesn't start game: play corner if 5 is already played         
          for(let i = 0; i < remains.length; i++) {
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
*/