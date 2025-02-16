// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router";
import { useUserStore } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import NotesPage from "./pages/NotesPage";
import WriteNotePage from "./pages/WriteNotePage";
import EditNotePage from "./pages/EditNotePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import Layout from "./components/Layout";
import { Outlet } from "react-router";
import CommunityPage from "./pages/CommunityPage";
import Calendar from "./pages/Calendar";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Layout>
                <NotesPage />
              </Layout>
            }
          />
          <Route
            path="/write"
            element={
              <Layout>
                <WriteNotePage />
              </Layout>
            }
          />
          <Route
            path="/community"
            element={
              <Layout>
                <CommunityPage />
              </Layout>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <Layout>
                <EditNotePage />
              </Layout>
            }
          />
          <Route
            path="/profile/:user_id"
            element={
              <Layout>
                <ProfilePage />
              </Layout>
            }
          />
          <Route
            path="/calendar"
            element={
              <Layout>
                <Calendar />
              </Layout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useUserStore();
  if (!user) {
    // Redirect to login page if not authenticated
    console.log(user);
    return <Navigate to="/login" />;
  }
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default App;
