import './App.css';
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogTransaction from "./pages/LogTransaction";
import Navbar from "./components/Nav/Navbar";
import WeightTracker from './pages/WeightTracker';
import IbsHelper from './pages/IbsHelper';

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
        <Route path="IBS-helper" element={<IbsHelper />} />
      </Routes>
    </Router>
  );
}

export default App;
