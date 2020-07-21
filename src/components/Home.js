import React from 'react';
import { Tabs, Spin, Row, Col, Radio } from 'antd';
import {
    GEO_OPTIONS,
    POS_KEY,
    API_ROOT,
    AUTH_HEADER,
    TOKEN_KEY,
    POST_TYPE_IMAGE,
    POST_TYPE_VIDEO,
    POST_TYPE_UNKNOWN,
    TOPIC_AROUND,
    TOPIC_FACE
} from '../constants';

import CreatePostButton from "./CreatePostButton"
import Gallery from './Gallery';
import AroundMap from "./AroundMap"

const { TabPane } = Tabs;

class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: '',
        posts: [],
        topic: TOPIC_AROUND,
    }

    componentDidMount() {
        console.log(navigator.geolocation);
        if ("geolocation" in navigator) {
            this.setState({ isLoadingGeoLocation: true, error: '' });
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailedLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({ error: 'Geolocation is not supported.'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({ lat: latitude, lon: longitude }));
        this.setState({ isLoadingGeoLocation: false, error: '' });
        this.loadNearbyPosts();
    }

    onFailedLoadGeoLocation = () => {
        this.setState({ isLoadingGeoLocation: false, error: 'Failed to load geo location.' });
    }

    loadNearbyPosts = (center, radius) => {
        const { lat, lon } = center?
            center:
            JSON.parse(localStorage.getItem(POS_KEY));
        const range = radius? radius: 20000;

        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: '' });
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${range}`, {
            method: 'GET',
            headers: {
                Authorization: `${AUTH_HEADER} ${token}`
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load post.');
            })
            .then((data) => {
                console.log(data);
                this.setState({ posts: data ? data : [], isLoadingPosts: false });
            })
            .catch((e) => {
                console.error(e);
                this.setState({ isLoadingPosts: false, error: e.message });
            });
    }

    renderPosts(type) {
        const { error, isLoadingGeoLocation, isLoadingPosts, posts } = this.state;
        if (error) {
            return error;
        } else if (isLoadingGeoLocation) {
            return <Spin tip="Loading geo location..."/>;
        } else if (isLoadingPosts) {
            return <Spin tip="Loading posts..."/>
        } else if (posts.length > 0) {
            //case1: images
            return type === POST_TYPE_IMAGE ?
                this.renderImagePosts():
                this.renderVideoPosts();
        } else {
            return 'No nearby posts';
        }
    }

    renderImagePosts = () => {
        const { posts } = this.state;
        const images = posts.filter(post => post.type === POST_TYPE_IMAGE)
            .map(post =>{
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                };
            })
        return <Gallery images={images}/>
    }
    renderVideoPosts = () => {
        const { posts } = this.state;
        return (
            <Row>
                {
                    posts
                        .filter(post => [POST_TYPE_VIDEO, POST_TYPE_UNKNOWN].includes(post.type))
                        .map(post => {
                            return (
                                <Col key={post.url} span={6}>
                                    <video src={post.url}
                                           controls={true}
                                           className="video-block"
                                    />
                                    <p>{post.user}: {post.message}</p>
                                </Col>
                            )
                        })
                }
            </Row>
        )
        const images = posts.filter(post => post.type === POST_TYPE_VIDEO)
            .map(post =>{
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                };
            })
        return <Gallery images={images}/>
    }

    handleTopicChange=(e)=>{
        console.log(e.target.value);
        this.setState({
            topic: e.target.value,
        })
    }
    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;

        return (
            <div>
                <Radio.Group onChange={this.handleTopicChange} value={this.state.topic}>
                    <Radio value={TOPIC_AROUND}>Posts Around Me</Radio>
                    <Radio value={TOPIC_FACE}>Faces Around The World</Radio>
                </Radio.Group>

                <Tabs tabBarExtraContent={operations} className="main-tabs">
                    <TabPane tab="Image Posts" key="1">
                        {this.renderPosts(POST_TYPE_IMAGE)}
                    </TabPane>
                    <TabPane tab="Video Posts" key="2">
                        {this.renderPosts(POST_TYPE_VIDEO)}
                    </TabPane>
                    <TabPane tab="Map" key="3">
                        <AroundMap
                            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                            loadingElement={<div style={{ height: `100%` }} />}
                            containerElement={<div style={{ height: `600px` }} />}
                            mapElement={<div style={{ height: `100%` }} />}
                            loadNearbyPosts = {this.loadNearbyPosts}
                            posts={this.state.posts}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default Home;
