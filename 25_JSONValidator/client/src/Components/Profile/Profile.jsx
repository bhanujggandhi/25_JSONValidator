import React, { useState } from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

const Profile = (props) => {
  const toast = useToast();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [username, setusername] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    const jwttoken = localStorage.getItem("jwtToken");

    const getuser = async () => {
      try {
        const requestOptions = {
          headers: { "Content-Type": "application/json", token: jwttoken },
        };
        const res = await axios.get(
          "http://localhost:5002/api/users/me",
          requestOptions
        );
        setname(res?.data.name);
        setemail(res?.data.email);
        setOrganization(res?.data.organization);
        setusername(res?.data.username);
      } catch (error) {
        toast({
          title: "Something went wrong",
          status: "error",
          duration: 10000,
          isClosable: true,
          position: "top",
        });
        console.log(error);
      }
    };

    getuser();
  }, []);
  return (
    <Flex
      minH={"85vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={4}
        w={"full"}
        maxW={"md"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        <FormControl id="userName" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="Full Name"
            _placeholder={{ color: "gray.500" }}
            value={name}
            onChange={(e) => setname(e.target.value)}
            type="text"
          />
        </FormControl>
        <FormControl id="email" isReadOnly>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            type="email"
            backgroundColor="lightgray"
            value={email}
          />
        </FormControl>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </FormControl>
        <FormControl id="organization" isReadOnly>
          <FormLabel>Organization</FormLabel>
          <Input
            placeholder="Organization"
            type="text"
            value={organization}
            backgroundColor="lightgray"
          />
        </FormControl>

        <Stack spacing={6} direction={["column", "row"]}>
          {/* <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
          >
            Submit
          </Button> */}
        </Stack>
      </Stack>
    </Flex>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
