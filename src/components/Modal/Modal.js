import React, { Component } from 'react';
import './Modal.css';

class Modal extends Component {
    render() {
        return (
            <div>
                <div
                    className="Modal"
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}>
                    <div style={{ textAlign: 'end' }}>
                        <button className="Button" onClick={this.props.closemodal}>Close</button>
                    </div>
                    <div>
                        <img
                            style={{
                                width: '100%',
                                maxHeight: '500px'
                            }}
                            src={this.props.url}
                            onClick={this.props.dialog}
                            alt="Images"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Modal;