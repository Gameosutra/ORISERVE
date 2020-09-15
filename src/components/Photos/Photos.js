import React, { useRef, useCallback } from 'react';
import './Photos.css';

const Photos = (props) => {

    // -- infinite loading logic -- Start --
    const observer = useRef();
    const lastPhoto = useCallback(node => {
        if(props.loading) return;
        if(observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting && props.photos.length >= props.pages) {
                props.callMore(props.pages,props.pagesNo+1);
            }
        })
        if(node) observer.current.observe(node);
    },[props.loading]);
    // -- end --

    return (
        <div className="grid-container">
        {props.photos.map((photo,index) => {
            if(props.photos.length === index+1) {
                return (
                    <div key={photo.attributes.id} ref={lastPhoto} className="div2">
                        <img 
                            src={photo.value} 
                            alt="ORI" 
                            className="img2 pointer"
                            onClick={() => props.dialog(photo.value)}/>
                    </div>
                );
            }
            else {
                return (
                    <div key={photo.attributes.id} className="div2">
                        <img 
                            src={photo.value} 
                            alt="ORI" 
                            className="img2 pointer"
                            onClick={() => props.dialog(photo.value)}/>
                    </div>
                );
            }
            
        })}
        </div>
    );
}

export default Photos;