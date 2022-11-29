import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../redux/actions/authActions";

import {
  Box,
  Stack,
  Heading,
  Container,
  Input,
  Button,
  SimpleGrid,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Link as CLink,
  Text,
} from "@chakra-ui/react";
import { Blur } from "./Blur";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errors: {},
      loading: false,
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  onChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  loginSubmit = (e) => {
    this.setState({ loading: true });
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData);
    this.setState({ loading: false });
  };

  render() {
    return (
      <Box position={"relative"} minH="85vh">
        <Container
          as={SimpleGrid}
          maxW={"7xl"}
          columns={{ base: 1, md: 2 }}
          spacing={{ base: 10, lg: 32 }}
          py={{ base: 10, sm: 20, lg: 32 }}
        >
          <Stack spacing={{ base: 10, md: 20 }}>
            <Heading
              lineHeight={1.1}
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
            >
              Start making your development error free
            </Heading>
            <Text color={"gray.300"} fontSize={{ base: "sm", sm: "2xl" }}>
              Login discover the power of validation.
            </Text>
          </Stack>
          <Stack
            bg={"gray.50"}
            rounded={"xl"}
            p={{ base: 4, sm: 6, md: 8 }}
            spacing={{ base: 8 }}
            maxW={{ lg: "lg" }}
          >
            <Stack spacing={4}>
              <Heading
                color={"gray.800"}
                lineHeight={1.1}
                fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
              >
                Login
              </Heading>
            </Stack>
            <Box as={"form"} mt={10}>
              <Stack spacing={4}>
                <FormControl isRequired isInvalid={this.state.errors?.email}>
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    Email address
                  </FormLabel>
                  <Input
                    placeholder="Enter your email"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    type="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
                  {this.state.errors?.email && (
                    <FormErrorMessage>
                      {this.state.errors.email}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  isRequired
                  isInvalid={
                    this.state.errors?.passwordIncorrect ||
                    this.state.errors?.password
                  }
                >
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    Password
                  </FormLabel>
                  <Input
                    placeholder="Enter your password"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    type="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                  {this.state.errors?.passwordIncorrect && (
                    <FormErrorMessage>
                      {this.state.errors.passwordIncorrect}
                    </FormErrorMessage>
                  )}
                  {this.state.errors?.password && (
                    <FormErrorMessage>
                      {this.state.errors.password}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Box color={"black"} py={2}>
                New User?{" "}
                <CLink as={Link} color="red.400" to={"/register"}>
                  Register
                </CLink>
              </Box>
              <Button
                isLoading={this.state.loading}
                loadingText="Logging in"
                fontFamily={"heading"}
                mt={3}
                w={"full"}
                bgGradient="linear(to-r, red.400,pink.400)"
                color={"white"}
                _hover={{
                  bgGradient: "linear(to-r, red.400,pink.400)",
                  boxShadow: "xl",
                }}
                onClick={this.loginSubmit}
              >
                Login
              </Button>
            </Box>
          </Stack>
        </Container>
        <Blur
          position={"absolute"}
          top={-10}
          left={-150}
          style={{ filter: "blur(70px)" }}
        />
      </Box>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { loginUser })(Login);
