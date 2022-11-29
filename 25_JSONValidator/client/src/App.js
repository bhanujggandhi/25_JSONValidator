import {
  Box,
  ChakraProvider,
  extendTheme,
  useColorMode,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import jwt_decode from "jwt-decode";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/private-route/PrivateRoute";
import { logoutUser, setCurrentUser } from "./redux/actions/authActions";
import store from "./redux/store";
import setAuthToken from "./utils/setAuthToken";

import AddFile from "./Components/AddFile/AddFile";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Dashboard from "./Components/Dashboard/Dashboard";
import EditFile from "./Components/EditFile/EditFile";
import Help from "./Components/Help/Help";
import MyFiles from "./Components/MyFiles/MyFiles";
import NotFound from "./Components/NotFound/NotFound";
import Profile from "./Components/Profile/Profile";
import Project from "./Components/Project/Project";
import ProjectPage from "./Components/Project/ProjectPage";
import Sidebar from "./Components/Sidebar/Sidebar";

import "./App.css";
import HelpPage from "./Components/Help/HelpPage";
import AllFiles from "./Components/AllFiles/AllFiles";

const theme = extendTheme({
  components: {
    Steps,
  },
});

function App() {
  // Check for token to keep user logged in
  if (localStorage.jwtToken) {
    // Set auth token header auth
    const token = localStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded)); // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser()); // Redirect to login
      window.location.href = "./login";
    }
  }
  const { colorMode, toggleColorMode } = useColorMode();
  if (colorMode === "light") toggleColorMode();

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Router>
          <Sidebar>
            <Box>
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/login" component={Login} />
                <Route path="/help" component={HelpPage} />
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard} />
                  <PrivateRoute exact path="/profile" component={Profile} />
                  <PrivateRoute exact path="/myfiles" component={MyFiles} />
                  <PrivateRoute exact path="/allfiles" component={AllFiles} />
                  <PrivateRoute exact path="/myfiles/new" component={AddFile} />
                  <PrivateRoute exact path="/projects" component={Project} />
                  <PrivateRoute path="/myfiles/:fileid" component={EditFile} />
                  <PrivateRoute
                    path="/projects/:projectid"
                    component={ProjectPage}
                  />
                  <Route path="*" component={NotFound} />
                </Switch>
                <Route path="*" component={NotFound} />
              </Switch>
            </Box>
          </Sidebar>
        </Router>
      </ChakraProvider>
    </Provider>
  );
}

export default App;
