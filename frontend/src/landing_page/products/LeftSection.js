import React from 'react';

function LeftSection({ imageURL, productName, productDescription, tryDemo, learnMore, googlePlay, appStore }) {
    return (
        <div className='container'>
            <div className='row'>
                <div className='col-6 p-3'>
                    <img src={imageURL}/>
                </div>
                <div className='col-6'>
                    <h1>{productName}</h1>
                    <p>{productDescription}</p>
                    <a href={tryDemo}>Try Demo</a>
                    <a href={learnMore}>Learn More</a>
                    <a href={googlePlay}><img src="media/images/googlePlayBadge.svg"/></a>
                    <a href={appStore}><img src="media/images/appStoreBadge.svg"/></a>
                </div>
            </div>
            
        </div>
    );
}

export default LeftSection;