import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Website Object Properties
// name: string  --> Image name stored in AWS s3 will match this +.png or .jpg
// description: string
// URL: string
// categories: [] array of strings?

// Expects array of website objects
function WebsiteCardListComponent() {

    const [websites, setWebsites] = useState([]);
    const [images, setImages] = useState([]);

    // Retrieve database information and corresponding images
    useEffect( () => {

        const loadWebsiteCards = async() => {
            const response = await axios.get('/api/retrieve-websites');
            const websiteDataDB = response.data.websites;
            setWebsites(websiteDataDB);
            
            const imageDataDB =  response.data.images;
            setImages(imageDataDB);

            return websiteDataDB;
        }

        loadWebsiteCards();
    }, []);

    return (
        <>
            <h1> Websites </h1>
            <ul>
                {websites.map(website => (
                    <a key={website.name} className='website-card' target='blank' href = {`https://${website.URL}`}>
                        <h3> {website.name} </h3>
                        <p> {website.description} </p>
                    </a> ))}
            </ul>
            <ul>
                {images.map((image, index) => (
                    <li key={index}>
                        <img src = {image} alt = '' ></img>
                    </li>
                ))}

            </ul>
        </>
    )
}

export default WebsiteCardListComponent
