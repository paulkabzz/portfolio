import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/home/page'
import Project from './pages/project/page'
import ProtectedRoute from './componets/protected-route'
import Admin from './pages/admin/page'
import Login from './pages/login/page'

function App() {

  return (
    <>
        <Routes>
          <Route  path='/' element={ <Home /> }/>
          <Route path='/project/:id' element={<Project />} />
          <Route path='/login' element={<Login />} />
          <Route element={<ProtectedRoute />} >
              <Route path='/admin' element={<Admin />} />
          </Route>
        </Routes>
    </>
  )
}

export default App
