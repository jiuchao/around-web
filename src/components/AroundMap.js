import React, {Component} from 'react';
import { withScriptjs, GoogleMap, withGoogleMap } from "react-google-maps"
import { POS_KEY } from "../constants"
import AroundMarker from "./AroundMarker"

class NormalAroundMap extends Component {

    getMapRef=(mapInstance)=>{
        this.map = mapInstance;
        window.map = mapInstance;
    }

    reloadMarker=()=>{
        //get center
        const center = this.map.getCenter();
        const centerobj = {lat: center.lat(), lon:center.lng()};
        console.log('center ->', centerobj);

        //get radius
        const radius = this.getRadius();
        //load nearby post
        this.props.loadNearbyPosts(centerobj, radius);

    }

    getRadius=()=>{
        const center = this.map.getCenter();
        const bound = this.map.getBounds();

        if(center && bound){
            const ne = bound.getNorthEast();
            const right = new window.google.maps.LatLng(center.lat(), ne.lng());
            return 0.001 * window.google.maps.geometry.spherical.computeDistanceBetween(center, right);
        }
    }
    render() {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        console.log(lat, lon);
        return (
            <GoogleMap
                ref={this.getMapRef}
                defaultZoom={9}
                defaultCenter={{ lat: lat, lng: lon }}
                onDragEnd={this.reloadMarker}
                onZoomChanged={this.reloadMarker}
            >
                { // marker data? posts from Home component
                    this.props.posts.map(post => <AroundMarker post={post} key={post.url} />)
                }
            </GoogleMap>
        );
    }
}

const AroundMap = withScriptjs(withGoogleMap(NormalAroundMap));
export default AroundMap;