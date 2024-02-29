import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Database structure:
// name: string  --> Image name stored in AWS s3 will match this +.png or .jpg
// description: string
// URL: string
// categories: [] array of strings?

// Expects array of website objects
function WebsiteCardListComponent() {

    const [websites, setWebsites] = useState([]);

    // Retrieve database information
    useEffect( () => {

        const loadWebsiteCards = async() => {
            const response = await axios.get('/api/retrieve-websites');
            const websiteDataDB = response.data;
            setWebsites(websiteDataDB);
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
        </>
    )
}

export default WebsiteCardListComponent
