import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Game from './components/Game'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Game />
                <p className='game-info'>
                    This game is a <a href='http://sshs.hs.kr/index.do'>SSHS</a> 
                    version of the game 2048. 
                </p>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App