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
    const [websiteNames, setWebsiteNames] = useState([]);

    // Retrieve database information
    useEffect( () => {

        const loadWebsiteCards = async() => {
            const response = await axios.get('/api/retrieve-websites');
            const websiteDataDB = response.data;
            setWebsites(websiteDataDB);
            
            // Store all the names in separate array
            const namesArray = websiteDataDB.map(website => website.name);
            setWebsiteNames(namesArray);

            return websiteDataDB;
        }

        const retrieveImages = async() => {
            const response = await axios.get('/api/retrieve-images');
            const imagesDB = response.data; // An array of Signed URLs
            setImages(imagesDB);
        }

        retrieveImages();
        loadWebsiteCards();
    }, []);

    // Retrieve the images when the website names have been loaded into the array
    useEffect(() => {
        const retrieveCorrespondingImages = async() => {
            const response = await axios.get('/api/retrieve-corresponding-images', 
                {params: {names: websiteNames}})
            console.log(response);
        } 

        if (websiteNames.length > 0) {
          retrieveCorrespondingImages();
        }
      }, [websiteNames]);

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
