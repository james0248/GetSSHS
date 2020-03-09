import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import indexPage from './components/index'

class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return indexPage
    }
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App