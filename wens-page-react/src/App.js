import './App.css';
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogTransaction from "./pages/LogTransaction";
import Navbar from "./components/Nav/Navbar";
import WeightTracker from './pages/WeightTracker';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-transactions" element={<LogTransaction />} />
        <Route path="/weight-tracker" element={<WeightTracker />} />
      </Routes>
    </Router>
  );
}

export default App;
