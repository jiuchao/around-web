import React, {Component} from 'react';
import ReactGallery from 'react-grid-gallery';
import PropTypes from 'prop-types';

class Gallery extends Component {
    static propTypes = {
        images: PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                thumbnail: PropTypes.string.isRequired,
                thumbnailHeight: PropTypes.number.isRequired,
                thumbnailWidth: PropTypes.number.isRequired,
                caption: PropTypes.string
            })
        ) //must be array, each of them should be of correct type
    }
    render() {
        const images = this.props.images.map(image =>{
            return {
                ...image,
                customOverlay:(
                    <div className = "gallery-thumbnail">
                        <div>{`${image.user}: ${image.caption}`}</div>
                    </div>
                )
            }
        })
        return (
            <div className = "gallery">
                <ReactGallery images = {images}
                              enableImageSelection={false}
                              backdropClosesModal
                />
            </div>
        );
    }
}

export default Gallery;