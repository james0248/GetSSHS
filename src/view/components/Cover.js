import React, { Component, createRef } from 'react'
import gsap from 'gsap'
import TextInput from './TextInput'
import success from '../../public/images/check.svg'
import fail from '../../public/images/x.svg'

class Cover extends Component {
    constructor(props) {
        super(props)
        let defaultName = window.localStorage.getItem('name')
        defaultName = defaultName === null ? '' : defaultName
        this.state = {
            name: defaultName,
            display: true,
        }
        this.ref = createRef()
        this.submitRef = createRef()
        this.onChange = this.onChange.bind(this)
    }

    componentDidUpdate() {
        if (this.props.display && this.state.display) {
            gsap.fromTo(
                this.ref.current,
                { opacity: 0 },
                {
                    delay: 0.5,
                    opacity: 1,
                    duration: 1.5,
                    onComplete: () => {
                        this.setState({ display: false })
                    },
                }
            )
        }
    }

    onChange(event) {
        const value = event.target.value
        this.setState({ name: value })
    }

    render() {
        let submitButton = (
            <a
                id="submit"
                className="button"
                onClick={(e) => {
                    e.preventDefault()
                    this.props.handleSubmit(this.state.name)
                }}
                onTouchEnd={(e) => {
                    e.preventDefault()
                    this.props.handleSubmit(this.state.name)
                }}
            >
                Submit
            </a>
        )
        if (this.props.success === 1) {
            submitButton = <img id="submit" src={success}></img>
        } else if (this.props.success === -1) {
            submitButton = <img id="submit" src={fail}></img>
        }
        if (this.props.display) {
            return (
                <div className="grid-cover" ref={this.ref}>
                    <p className="game-over">Game Over!</p>
                    <div className="score">
                        You Scored {this.props.score} points!
                    </div>
                    <div className="ranking">
                        <TextInput
                            id="name"
                            label="이름을 입력하세요"
                            onChange={this.onChange}
                            value={this.state.name}
                        />
                        {submitButton}
                    </div>
                    <a
                        className="button"
                        onClick={() => {
                            this.setState({ display: true })
                            this.props.handleRetry()
                        }}
                    >
                        Retry
                    </a>
                </div>
            )
        }
        return <div></div>
    }
}

export default Cover
