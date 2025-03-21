import "bootstrap/dist/css/bootstrap.min.css";
import BookList from "./BookList";

function App() {
    return (
        <div className="container">
            <h1 className="my-4">Bookstore</h1>
            <BookList />
        </div>
    );
}

export default App;
