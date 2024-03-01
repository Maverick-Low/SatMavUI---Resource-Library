import './App.css';
import WebsiteCardListComponent from './Components/WebsiteCardListComponent';

function App() {

    return (
        <>  
            <form action="/upload" method="POST" encType="multipart/form-data">
                <input type="file" name="image" />
                <button type="submit">Upload</button>
            </form>
            <WebsiteCardListComponent/>
        </>
    );
}

export default App;
