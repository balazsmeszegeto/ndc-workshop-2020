import React from 'react';
import './Reconnect.css';

export function Reconnect(props) {
    const containerStyle = props.online
        ? { opacity: 0, visibility: 'hidden' }
        : { opacity: 1 };

    return <div id="reconnecting-container" style={containerStyle}>
        <div className="reconnecting">
            <h1>Connection lost</h1>
            <p>Attempting to reconnect</p>
            <div className="loader"></div>
        </div>
    </div>
}