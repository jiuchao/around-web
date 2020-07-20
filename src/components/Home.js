import React from 'react';
import { Tabs, Spin, Row, Col } from 'antd';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY, POST_TYPE_IMAGE, POST_TYPE_UNKNOWN, POST_TYPE_VIDEO } from '../constants'

import CreatePostButton from "./CreatePostButton"
import Gallery from './Gallery';

const { TabPane } = Tabs;

class Home extends React.Component {
    state = {
        isLoadingGeoLocation: false,
        isLoadingPosts: false,
        error: '',
        posts: [],
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


    loadNearbyPosts = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({ isLoadingPosts: true, error: '' });
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
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
                        .map(post => (
                            <Col>
                                HAHA
                            </Col>
                        ))
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
    render() {
        const operations = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;

        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Image Posts" key="1">
                    {this.renderPosts(POST_TYPE_IMAGE)}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    {this.renderPosts(POST_TYPE_VIDEO)}
                </TabPane>
                <TabPane tab="Map" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        );
    }
}
export default Home;
