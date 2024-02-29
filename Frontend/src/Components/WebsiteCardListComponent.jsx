import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';


// Database structure:
// name: string  --> Image name stored in AWS s3 will match this +.png or .jpg
// description: string
// URL: string
// categories: [] array of strings?

// Expects array of website objects
function WebsiteCardListComponent( {websites}) {

    const [website, setWebsite] = useState({});

    // Retrieve database information
    useEffect( () => {

        const loadWebsiteCards = async() => {
            const response = await axios.get('/api/retrieve-websites');
            const data = response.data;
            setWebsite(data);
            return data;
        }

      loadWebsiteCards();

    }, []);

    return (
        // <>
        //     <h1> Websites </h1>
        //     {websites.map(website => {
        //         <div key={website.name} className='website-card' href = {website.URL}>
        //             <h3> {website.name} </h3>
        //             <p> {website.description} </p>
        //         </div>
        //     })}
        // </>
        <>
            <h1> Websites </h1>
            
            <div className='website-card'>
                <h3> {website.name} </h3>
                <p> {website.description}</p>
            </div>
            
        </>
    )
}

export default WebsiteCardListComponent
