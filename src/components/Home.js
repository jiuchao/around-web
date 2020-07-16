import { Tabs, Button, Spin, Alert } from 'antd';
import React, {Component} from 'react';
import { GEO_OPTIONS, POS_KEY, API_ROOT, AUTH_HEADER, TOKEN_KEY } from '../constants'
import Gallery from "./Gallery"

const { TabPane } = Tabs;
const operations = <Button>Create New Post</Button>;
class Home extends Component {
    state = {
        isLoadingGeo: false,
        isLoadingPosts: false,
        posts: [],
        err: ''
    }

    render() {
        return (
            <Tabs tabBarExtraContent={operations}>
                <TabPane tab="Image Posts" key="1">
                    {this.renderImagePosts()}
                </TabPane>
                <TabPane tab="Video Posts" key="2">
                    Content of tab 2
                </TabPane>
                <TabPane tab="Map" key="3">
                    Content of tab 3
                </TabPane>
            </Tabs>
        );
    }

    componentDidMount() {
        if("geolocation" in navigator){
            this.setState({ isLoadingGeo: true});
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeolocation,
                this.onFailedLoadGeolocation,
                GEO_OPTIONS,
            )
        } else {
            this.setState({
                err: 'Geolocation is not supported'
            })
        }
    }

    onSuccessLoadGeolocation =(position) =>{
        console.log(position);
        const { latitude, longitude } = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({ lat:latitude, lon: longitude }));
        this.setState({
            isLoadingGeo: false,
            err: ''
        })
        this.loadNearbyPosts();
    }

    loadNearbyPosts =() =>{
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        const token = localStorage.getItem(TOKEN_KEY);
        this.setState({
            isLoadingPosts: true,
            err: ''
        })
        return fetch(`${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`, {
            method: "GET",
            headers: { Authorization: `${AUTH_HEADER} ${token}`}
        }).then(response =>{
            if(response.ok){
                return response.json();
            }
            throw new Error("fetch posets failed")
        }).then(data =>{
            console.log(data);
            this.setState({
                posts: data ? data: [],
                isLoadingPosts: false
            })
        })
            .catch( e => {
                console.error(e);
                this.setState({
                    isLoadingPosts: false,
                    error: e.message
                });
            })
    }

    renderImagePosts = () => {
        //step 1: data
        const { posts, err } = this.state;

        // err
        if(err){
            return err;
        } else if(this.state.isLoadingGeo){
            //loading geolocation
            return <Spin tip = "Loading Geolocation"/>
        } else if(this.state.isLoadingPosts){
            //loading posts
            return <Spin tip={ "Loading posts"} />
        } else if(posts.length > 0){
            const images = posts.map(post =>{
                return {
                    user: post.user,
                    src: post.url,
                    thumbnail: post.url,
                    caption: post.message,
                    thumbnailWidth: 400,
                    thumbnailHeight: 300,
                }
            });
            return <Gallery iamges={images}/>
        } else{
            return "No posts";
        }


        //loading posts

        //get posts


    }

    onFailedLoadGeolocation =() =>{
        this.setState({
            isLoadingGeoLocation: false,
            error: 'Failed to load geo location.'
        });
    }
}

export default Home;