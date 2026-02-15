import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./components/landing";
import DashBoard from "./components/dashborad";
import DashBoardAdmin from "./components/dashboradAdmin"
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/"  element={  localStorage.getItem("token") ? (    <Navigate to="/dashboard" />  ) : (    <Landing />    )  }  />
        <Route   path="/dashboard/student" element={<ProtectedRoute><DashBoard /></ProtectedRoute>}/>
        <Route   path="/dashboard/admin" element={<ProtectedRoute><DashBoardAdmin /></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
  );
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default App;
