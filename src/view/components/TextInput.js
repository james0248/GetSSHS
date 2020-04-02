import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TextInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            focussed: props.focussed,
            error: props.error || '',
        }
    }

    render() {
        const { focussed } = this.state
        const { id, value, label } = this.props
        const fieldValue = `field ${(focussed || value) && 'focussed'}`
        return (
            <div className={fieldValue}>
                <input
                    id={id}
                    type="text"
                    value={value}
                    placeholder={label}
                    onChange={this.props.onChange}
                />
            </div>
        )
    }
}

TextInput.propTypes = {
    id: PropTypes.string.isRequired,
    value: PropTypes.string,
    label: PropTypes.string,
    onChange: PropTypes.func,
}

export default TextInput
