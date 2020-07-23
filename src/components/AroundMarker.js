import React, {Component} from 'react';
import { Marker, InfoWindow} from "react-google-maps"
import PropTypes from 'prop-types';
import blueIcon from '../assets/images/blue-marker.svg';

class AroundMarker extends Component {
    static propTypes = {
        post: PropTypes.object.isRequired,
    }

    state = {
        isOpen: false
    }

    handleToggle = ()=>{
        // this.setState(preState => ({
        //     isOpen: !preState.isOpen
        // }))
        this.setState(preState => {
            console.log('prestate -> ', preState)
            return {
                isOpen: !preState.isOpen
            }
        })
    }

    render() {
        const { user, message, url, location, type } = this.props.post;
        const { lat, lon } = location;
        const isImage = type === 'image';
        const customizedIcon = isImage ? undefined: {
            url: blueIcon,
            scaledSize: new window.google.maps.Size(26, 41),
        };
        return (
            <Marker
                position={{ lat, lng: lon }}
                onClick={this.handleToggle}
                onMouseOver={isImage ? this.handleToggle : undefined}
                onMouseOut={isImage ? this.handleToggle : undefined}
                onClick={isImage ? undefined: this.handleToggle}
                icon={customizedIcon}
            >
                {
                    this.state.isOpen ? (
                        <InfoWindow>
                            <div>
                                {
                                    isImage ?
                                        <img src={url} alt={message} className="around-marker-image"/>
                                        :
                                        <video src={url} controls className="around-marker-video"/>
                                }
                                <p>{`${user}:${message}`}</p>
                            </div>
                        </InfoWindow>
                    ) : null
                }
            </Marker>
        );
    }
}

export default AroundMarker;