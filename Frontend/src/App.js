import './App.css';

function App() {
  return (
    <form action="/upload" method="POST" enctype="multipart/form-data">
        <input type="file" name="image" />
        <button type="submit">Upload</button>
    </form>
  );
}

export default App;
