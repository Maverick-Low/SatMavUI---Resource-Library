import React from 'react'
import './WebsiteCardComponent.css';


// 1. Retrieve name, description from MongoDB
// 2. Retrieve image key (original file name) from MongoDB and then fetch the corresponding image from AWS S3 Bucket

// Questions: 
// 1. Is it better to retrieve each image singularly each card - or do 1 query to AWS to retrieve all images for all cards

function WebsiteCard( {website} ) {
    console.log(website);

    if(!website) {
        return null;
    }

    return (
        
        <div class="card">
            <div class="header">
                <div class="top">
                    <div class="circle">
                        <span class="red circle2"></span>
                    </div>
                    <div class="circle">
                        <span class="yellow circle2"></span>
                    </div>
                    <div class="circle">
                        <span class="green circle2"></span>
                    </div>
                </div>
            </div>

            <a key={website.name} className='website-card' target='blank' href = {`https://${website.URL}`}>
                <div className="image-section">
                    <div className="image-container">
                        <img src = {website.image} alt = '' ></img>
                    </div>
                </div>
                <h3> {website.name} </h3>
                <p> {website.description} </p>
            </a>
        </div>
    )
}

export default WebsiteCard
