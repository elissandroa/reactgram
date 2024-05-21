import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { NavBar } from './components/Navbar';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { EditProfile } from './pages/EditProfile';
import { Profile } from './pages/Profile';
import { Photo } from './pages/Photo';
import { Search } from './pages/Search';





function App() {

  const { auth, loading } = useAuth();

  if (loading) {
    <p>Carregando...</p>
  }

  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path='/' element={auth ? <Home /> : <Navigate to={"/login"} />} />
          <Route path='/login' element={!auth ? <Login /> : <Navigate to={"/"} />} />
          <Route path='/profile' element={auth ? <EditProfile /> : <Navigate to={"/login"} />} />
          <Route path='/users/:id' element={<Profile />} />
          <Route path='/register' element={!auth ? <Register /> : <Navigate to={"/"} />} />
          <Route path='/search' element={auth ? <Search /> : <Navigate to={"/login"} />} />
          <Route path='/photos/:id' element={auth ? <Photo /> : <Navigate to={"/login"} />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
