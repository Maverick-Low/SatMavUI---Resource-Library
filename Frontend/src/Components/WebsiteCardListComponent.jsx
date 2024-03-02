import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import './WebsiteCardListComponent.css';

// Website Object Properties
// name: string  --> Image name stored in AWS s3 will match this +.png or .jpg
// description: string
// URL: string
// categories: [] array of strings?

// Expects array of website objects
function WebsiteCardListComponent() {

    const [websites, setWebsites] = useState([]);

    // Retrieve database information and corresponding images
    useEffect( () => {

        const loadWebsiteCards = async() => {
            const response = await axios.get('/api/retrieve-websites');
            const websiteDataDB = response.data.websites;
            setWebsites(websiteDataDB);   

            return websiteDataDB;
        }

        loadWebsiteCards();
    }, []);

    return (
        <>
            <h1> Websites </h1>
            <div className="website-list-wrapper">
                <ul className='website-list'>
                    {websites.map(website => (
                        <a key={website.name} className='website-card' target='blank' href = {`https://${website.URL}`}>
                            <div className="image-section">
                                <div className="image-container">
                                    <img src = {website.image} alt = '' ></img>
                                </div>
                            </div>
                            <h3> {website.name} </h3>
                            <p> {website.description} </p>
                        </a> ))}
                </ul>
            </div>
            
        </>
    )
}

export default WebsiteCardListComponent
