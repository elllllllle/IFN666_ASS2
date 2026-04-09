import { Routes, Route } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import Layout from './pages/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import MyLogs from './pages/MyLogs'
import MyShelves from './pages/MyShelves'
import BookDetail from './pages/BookDetail'
import NoPage from './pages/NoPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="books/:id" element={<BookDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="logs" element={<MyLogs />} />
            <Route path="shelves" element={<MyShelves />} />
          </Route>
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}