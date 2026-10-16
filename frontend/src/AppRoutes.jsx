import { Navigate, Route, Routes } from 'react-router-dom'
import App from './App'

function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page took a wrong turn.</h1>
      <a className="dark-button" href="/">Return home</a>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/courses" element={<App />} />
      <Route path="/course/:courseId" element={<App />} />
      <Route path="/instructor/dashboard" element={<App />} />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}

export default AppRoutes
