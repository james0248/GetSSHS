import React, { Component } from 'react'

import logo_1 from '../../public/images/한과영.png'
import logo_2 from '../../public/images/대구.png'
import logo_3 from '../../public/images/대전.png'
import logo_4 from '../../public/images/인천.png'
import logo_5 from '../../public/images/광주.png'
import logo_6 from '../../public/images/경곽.png'
import logo_7 from '../../public/images/설곽.png'

const image = {
    1: logo_1,
    2: logo_2,
    3: logo_3,
    4: logo_4,
    5: logo_5,
    6: logo_6,
    7: logo_7,
}

class Tile extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <img
                src={image[this.props.rank]}
                width={200}
                height={200}
            ></img>
        )
    }
}

export default Tile