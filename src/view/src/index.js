import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Grid from './components/Grid'

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <div style={style}>
                    <Grid />
                </div>
                <p className='game-info'>
                    This game is a <a href='http://sshs.hs.kr/index.do'>SSHS</a>
                    version of the game 2048.
                </p>
            </div>
        )
    }
}
const style = {
    borderWidth: '7px',
    borderColor: 'black',
    borderStyle: 'solid',
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App