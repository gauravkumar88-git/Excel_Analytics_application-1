import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Dashboard from './components/Dashboard';
import Center from './components/Center';
import UploadFile from './components/UploadFile';
import ChartComponent from './components/ChartComponent';
import History from './components/History';

export default function App() {
  
  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Center />} />
        <Route path="center" element={<Center />} />
        <Route path="uploadfile" element={<UploadFile />} />
        <Route path="chartcomponent" element={<ChartComponent />} />
        <Route path="history" element={<History />} />
      </Route>

    </Routes>
  );
}
