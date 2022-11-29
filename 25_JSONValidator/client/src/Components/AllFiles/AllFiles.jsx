import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import FileRow from "../MyFiles/FileRow";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const AllFiles = ({ auth }) => {
  const [data, setdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const getmyfiles = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await axios.get(
        "http://localhost:5002/api/json/all",
        requestOptions
      );

      setdata(res.data);
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
  useEffect(() => {
    const f = async () => {
      setLoading(true);
      await getmyfiles();
      setLoading(false);
    };
    f();
  }, []);

  return loading ? (
    <>
      <Flex
        width={"100vw"}
        height={"85vh"}
        justifyContent="center"
        alignItems={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    </>
  ) : (
    <Box minH="85vh">
      <Flex justifyContent={"space-between"} mx={"60px"} py={"30px"}>
        <Heading>All Grammar Files</Heading>
      </Flex>
      <Flex direction="column" mx={"60px"}>
        {data.length > 0 ? (
          data
            .filter((r) => r.ownerid._id !== auth.user.id)
            .map((row) => {
              return (
                <FileRow
                  key={row._id}
                  name={row.name}
                  organization={row.ownerid.organization}
                  owner={row.ownerid.name}
                />
              );
            })
        ) : (
          <Center>
            <Image src="/assets/empty.png" maxW="300px" />
          </Center>
        )}
      </Flex>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AllFiles);
