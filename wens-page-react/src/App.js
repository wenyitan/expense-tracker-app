import './App.css';
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogTransaction from "./pages/LogTransaction";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-transactions" element={<LogTransaction />} />
      </Routes>
    </Router>
  );
}

export default App;
