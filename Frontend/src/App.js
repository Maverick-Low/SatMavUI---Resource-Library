import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import WebsiteCardListComponent from './Components/WebsiteCardListComponent';

function App() {

    const [images, setImage] = useState([]);

    useEffect( () => {
        const retrieveImages = async() => {
            const response = await axios.get('/api/retrieve-images');
            const imagesDB = response.data; // An array of Signed URLs
            console.log('ImagesDB:', imagesDB);
            setImage(imagesDB);
        }

        retrieveImages();
    }, []);
   

    return (
        <>  
            <WebsiteCardListComponent/>
            <form action="/upload" method="POST" encType="multipart/form-data">
                <input type="file" name="image" />
                <button type="submit">Upload</button>
            </form>
            <ul>
                {images.map((image, index) => (
                    <li key={index}>
                        <img src = {image} alt = 'lol' ></img>
                    </li>
                ))}

            </ul>
        </>
        
    );
}

export default App;
