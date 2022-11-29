import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import validator from "validator";
import { registerUser } from "../../redux/actions/authActions";
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

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      username: "",
      organization: "",
      password: "",
      password2: "",
      errors: {},
      nameerr: "",
      emailerr: "",
      usernameerr: "",
      organizationerr: "",
      passworderr: "",
      password2err: "",
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

  onChangeName = (e) => {
    if (validator.isEmpty(e.target.value)) {
      this.setState({ nameerr: "Name cannot be empty" });
    } else this.setState({ nameerr: "" });

    this.setState({ name: e.target.value });
  };
  onChangeUsername = (e) => {
    if (validator.isEmpty(e.target.value)) {
      this.setState({ usernameerr: "Username cannot be empty" });
    } else this.setState({ usernameerr: "" });
    this.setState({ username: e.target.value });
  };
  onChangeOrganization = (e) => {
    if (validator.isEmpty(e.target.value)) {
      this.setState({ organizationerr: "Organization cannot be empty" });
    } else {
      this.setState({ organizationerr: "" });
    }
    this.setState({ organization: e.target.value });
  };
  onChangeEmail = (e) => {
    if (!validator.isEmail(e.target.value)) {
      this.setState({ emailerr: "Invalid Email" });
    } else {
      this.setState({ emailerr: "" });
    }
    this.setState({ email: e.target.value });
  };
  onChangePassword = (e) => {
    if (!validator.isLength(e.target.value, { min: 6, max: 20 })) {
      this.setState({
        passworderr: "Password length must be 6 to 20 characters",
      });
    } else {
      this.setState({
        passworderr: "",
      });
    }
    this.setState({ password: e.target.value });
  };
  onChangePassword2 = (e) => {
    if (e.target.value !== this.state.password) {
      this.setState({
        password2err: "Password does not match",
      });
    } else {
      this.setState({
        password2err: "",
      });
    }
    this.setState({ password2: e.target.value });
  };

  registerSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      organization: this.state.organization,
      username: this.state.username,
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const {
      name,
      password,
      password2,
      email,
      organization,
      username,
      nameerr,
      usernameerr,
      organizationerr,
      passworderr,
      emailerr,
      password2err,
    } = this.state;
    return (
      <Box position={"relative"}>
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
              Create an account and discover the power of validation.
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
                Create your account
              </Heading>
            </Stack>
            <Box as={"form"} mt={10}>
              <Stack spacing={4}>
                <FormControl isRequired isInvalid={!!nameerr}>
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    Full Name
                  </FormLabel>
                  <Input
                    placeholder="Enter your full name"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    value={name}
                    onChange={this.onChangeName}
                    id="name"
                  />
                  {!!nameerr && <FormErrorMessage>{nameerr}</FormErrorMessage>}
                </FormControl>
                <FormControl isRequired isInvalid={!!usernameerr}>
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    User Name
                  </FormLabel>
                  <Input
                    placeholder="Enter your username"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    value={username}
                    onChange={this.onChangeUsername}
                    id="username"
                  />
                  {!!usernameerr && (
                    <FormErrorMessage>{usernameerr}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!!organizationerr}>
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    organization
                  </FormLabel>
                  <Input
                    placeholder="Enter your organization"
                    bg={"gray.100"}
                    border={0}
                    color={"gray.500"}
                    _placeholder={{
                      color: "gray.500",
                    }}
                    value={organization}
                    onChange={this.onChangeOrganization}
                    id="organization"
                  />
                  {!!organizationerr && (
                    <FormErrorMessage>{organizationerr}</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isRequired isInvalid={!!emailerr}>
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
                    value={email}
                    onChange={this.onChangeEmail}
                    id="email"
                  />
                  {!!emailerr && (
                    <FormErrorMessage>{emailerr}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!passworderr}>
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
                    id="password"
                    value={password}
                    onChange={this.onChangePassword}
                  />
                  {!!passworderr && (
                    <FormErrorMessage>{passworderr}</FormErrorMessage>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!password2err}>
                  <FormLabel color={"gray.800"} fontSize={"sm"}>
                    Confirm Password
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
                    id="password2"
                    value={password2}
                    onChange={this.onChangePassword2}
                  />
                  {!!password2err && (
                    <FormErrorMessage>{password2err}</FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Box color={"black"} py={2}>
                Already a user?{" "}
                <CLink as={Link} color="red.400" to={"/login"}>
                  Login
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
                onClick={this.registerSubmit}
                disabled={
                  !!nameerr ||
                  !!organizationerr ||
                  !!usernameerr ||
                  !!emailerr ||
                  !!passworderr ||
                  !!password2err ||
                  !name ||
                  !organization ||
                  !username ||
                  !email ||
                  !password ||
                  !password2
                }
              >
                Register
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
Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});
export default connect(mapStateToProps, { registerUser })(withRouter(Register));
