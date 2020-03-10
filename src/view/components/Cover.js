import React, { Component, createRef } from 'react'
import gsap from 'gsap'

class Cover extends Component {
    constructor(props) {
        super(props)
        this.ref = createRef()
    }

    componentDidUpdate() {
        if (this.props.display) {
            gsap.fromTo(this.ref.current, { opacity: 0 }, {
                opacity: 1,
                duration: 2,
            })
        }
    }

    render() {
        if (this.props.display) {
            return (
                <div className='grid-cover' ref={this.ref}>
                    <p className='game-over'>Game Over!</p>
                    <div className='score'>You Scored {} points!</div>
                    <input type='text' id='name'>Your name</input>
                    <a className='button' onClick={this.props.handleRetry}>Retry</a>
                </div>
            )
        }
        return <div></div>
    }
}

export default Cover