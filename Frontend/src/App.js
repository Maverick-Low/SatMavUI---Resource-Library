import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {

    const [images, setImages] = useState([]);

    useEffect( () => {
        const retrieveImages = async() => {
            const response = await axios.get('/api/retrieveImages');
            const imagesDB = response.data; // Expect an array of image objects
            setImages(imagesDB);
            // Loop through images and display them;
            console.log("IMAGES:", images);
        }

        retrieveImages();
    }, []);
   

    return (
        <>
            <form action="/upload" method="POST" encType="multipart/form-data">
                <input type="file" name="image" />
                <button type="submit">Upload</button>
            </form>
            <ul>
                {images.map((image, index) => (
                    <li key={index}>{image}</li>
                ))}
            </ul>
        </>
        
    );
}

export default App;
