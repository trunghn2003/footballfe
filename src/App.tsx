import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import News from './pages/News';
import Matches from './pages/Matches';
import Teams from './pages/Teams';
import Areas from './pages/Areas';
import AreaDetail from './pages/AreaDetail';
import Login from './pages/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import Competitions from './pages/Competitions';
import CompetitionDetail from './pages/CompetitionDetail';
import CompetitionMatches from './pages/CompetitionMatches';
import MatchDetail from './pages/MatchDetail';
import NewsDetail from './pages/NewsDetail';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100vw',
            overflowX: 'hidden'
          }}>
            <Header />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: '100%',
                py: 3,
                backgroundColor: '#f5f5f5'
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/news"
                  element={
                    <ProtectedRoute>
                      <News />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/news/:id"
                  element={
                    <ProtectedRoute>
                      <NewsDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <ProtectedRoute>
                      <Matches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/teams"
                  element={
                    <ProtectedRoute>
                      <Teams />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/areas"
                  element={
                    <ProtectedRoute>
                      <Areas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/areas/:id"
                  element={
                    <ProtectedRoute>
                      <AreaDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/competitions"
                  element={
                    <ProtectedRoute>
                      <Competitions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/competitions/:id"
                  element={
                    <ProtectedRoute>
                      <CompetitionDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/competitions/:id/matches"
                  element={
                    <ProtectedRoute>
                      <CompetitionMatches />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/matches/:id"
                  element={
                    <ProtectedRoute>
                      <MatchDetail />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
