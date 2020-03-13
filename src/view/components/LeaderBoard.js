import React, { Component } from 'react'

class LeaderBoard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ranking: [],
            loading: true
        }
    }

    componentDidMount() {
        this.updateRanking(this)
    }

    async updateRanking(self) {
        const response = (await (await fetch('http://localhost:8000/ranking'))
            .json())
            .map((info, index) => {
                return (
                    <tr key={index} className='ranking-row'>
                        <th>{'#' + (index + 1).toString()}</th>
                        <th>{info.name}</th>
                        <th>{info.score}</th>
                        <th>{info.time}</th>
                    </tr>
                )
            })
        self.setState({ ranking: response })
    }

    render() {
        return (
            <div className='leaderBoard'>
                <div className='ranking-header'>
                    <h2>LeaderBoard</h2>
                    <div
                        onClick={() => { let self = this; this.updateRanking(self) }}
                        className='button'
                        id='refresh'
                    >Refresh</div>
                </div>
                <hr></hr>
                <table>
                    <tbody>
                        <tr className='ranking-row'>
                            <th>등수</th>
                            <th>이름</th>
                            <th>점수</th>
                            <th>기록 시간</th>
                        </tr>
                        {this.state.ranking}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LeaderBoard