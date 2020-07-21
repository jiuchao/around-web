import React, {Component} from 'react';
import { Marker, InfoWindow} from "react-google-maps"
import PropTypes from 'prop-types';

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
        //console.log(this.props.post);
        //const { isOpen } = this.state;
        //console.log(isOpen)
        const { user, message, url, location } = this.props.post;
        const { lat, lon } = location;
        return (
            <Marker
                position={{ lat, lng: lon }}
                onClick={this.handleToggle} >
                {
                    this.state.isOpen ? (
                        <InfoWindow>
                            <div>
                                <img src={url} alt={message} className="around-marker-image"/>
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