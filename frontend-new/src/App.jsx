import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Customer from "./pages/Customer/CustomerPage";
import Agent from "./pages/Agent/AgentPage";
import TravelHomePage from "./pages/Travel/TravelHomePage";
import ConversationsLandingPage from "./pages/Conversations/ConversationsLandingPage";
import AgentConversationPage from "./pages/Conversations/AgentConversationPage";
import CustomerConversationPage from "./pages/Conversations/CustomerConversationPage";
import { ConversationProvider } from "./contexts/ConversationContext";
import GlobalCursorPointer from "./components/GlobalCursorPointer";
import theme from "./theme/theme";

// Component to determine user type based on route
const AppContent = () => {
  const location = useLocation();
  
  // Determine user type based on current route
  const getUserType = () => {
    if (location.pathname.includes('/customer') || location.pathname.includes('/conversations/') && location.pathname.includes('/customer')) {
      return 'customer';
    }
    return 'agent';
  };

  const userType = getUserType();

  return (
    <>
      <Routes>
        <Route path="/" element={<TravelHomePage />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/agent" element={<Agent />} />
        <Route path="/conversations" element={<ConversationsLandingPage />} />
        <Route path="/conversations/:sessionId" element={<AgentConversationPage />} />
        <Route path="/conversations/:sessionId/customer" element={<CustomerConversationPage />} />
      </Routes>
      {/* Global cursor pointer - enabled for all pages */}
      <GlobalCursorPointer userType={userType} enabled={true} />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConversationProvider>
        <Router>
          <AppContent />
        </Router>
      </ConversationProvider>
    </ThemeProvider>
  );
}

export default App;
