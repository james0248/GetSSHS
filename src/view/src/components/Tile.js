import React, { Component, createRef } from 'react'
import gsap from 'gsap'

import logo_1 from '../../public/images/한과영.png'
import logo_2 from '../../public/images/광주.png'
import logo_3 from '../../public/images/대구.png'
import logo_4 from '../../public/images/대전.png'
import logo_5 from '../../public/images/세종예술.png'
import logo_6 from '../../public/images/경곽.png'
import logo_7 from '../../public/images/인천.png'
import logo_8 from '../../public/images/세곽.png'
import logo_9 from '../../public/images/한곽.png'
import logo_10 from '../../public/images/설곽.png'

const image = {
    1: logo_1,
    2: logo_2,
    3: logo_3,
    4: logo_4,
    5: logo_5,
    6: logo_6,
    7: logo_7,
    8: logo_8,
    9: logo_9,
    10: logo_10,
}

class Tile extends Component {
    constructor(props) {
        super(props)
        this.ref = createRef()
    }

    componentDidUpdate() {
        if(this.props.tile.isNew) {
            gsap.fromTo(this.ref.current, { scale: 0 }, { scale: 1, duration: 0.2 })
        }
        if(this.props.tile.isMerged) {
            gsap.fromTo(this.ref.current, { scale: 1 }, {
                scale: 1.2,
                duration: 0.08,
                yoyo: true,
                repeat: 1,
            })
        }
    }

    render() {
        if(this.props.tile.rank === 0) {
            return (
                <div
                    className='empty tile'
                    ref={this.ref}
                >
                </div>
            )
        }
        return (
            <div className='tile'>
                <div className='tile-background'></div>
                <img
                    src={image[this.props.tile.rank]}
                    className='grid tile'
                    ref={this.ref}
                ></img>
            </div>
        )
    }
}

export default Tile