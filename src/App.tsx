import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import KanbanBoard from './components/KanbanBoard'
import Login from './auth/Login'
import SignUp from './auth/SignUp'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<KanbanBoard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
