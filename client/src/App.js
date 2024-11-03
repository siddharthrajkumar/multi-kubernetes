import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OtherPage from './OtherPage';
import Fib from './fib';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-Header">
          <h1>Fibonacci Calculator</h1>
          <Link to="/" >Home</Link>
          <br/>
          <Link to="/otherpage" >Other Page</Link>
        </header>
        <br/>
        <div>
          <Routes>
            <Route exact path="/" element={<Fib />} />
            <Route path="/otherpage" element={<OtherPage />} />
          </Routes>
        </div>  
      </div>
    </Router>
  );
}

export default App;
