import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
  VStack,
  Link as CLink,
  Image,
} from "@chakra-ui/react";
import ProjectRow from "../Project/ProjectRow";
import { connect } from "react-redux";
import Axios from "axios";
import FileRow from "../MyFiles/FileRow";
import { Link } from "react-router-dom";

const Dashboard = ({ auth }) => {
  const date = new Date();
  let hours = date.getHours();
  let greet = { message: "", image: "" };

  // if (hours < 12) {
  //   greet.message = " Good Morning, " + auth.user.name.split(" ")[0];
  //   greet.image = "url(https://wallpapercave.com/wp/wp2833173.jpg)";
  // } else if (hours <= 17 && hours >= 12) {
  //   greet.message = " Good Afternoon, " + auth.user.name.split(" ")[0];
  //   greet.image = "url(https://wallpapercave.com/wp/wp2833173.jpg)";
  // } else {
  //   greet.message = " Good Evening, " + auth.user.name.split(" ")[0];
  //   greet.image =
  //     "url(https://images.wallpaperscraft.com/image/single/sunset_dark_twilight_148787_1920x1080.jpg)";
  // }

  const [recentProjects, setRecentProjects] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const getRecentProjects = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.get(
        "http://localhost:5002/api/project/recent",
        requestOptions
      );

      setRecentProjects(res.data);
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

  const getRecentFiles = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.get(
        "http://localhost:5002/api/json/recent",
        requestOptions
      );

      setRecentFiles(res.data);
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
      await getRecentProjects();
      await getRecentFiles();
      setLoading(false);
    };
    f();
  }, []);

  return (
    <Box minH={"85vh"}>
      <Stack minH={"25vh"} direction={{ base: "column", md: "row" }}>
        <Flex p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={6} w={"full"} maxW={"lg"}>
            <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
              <Text
                as={"span"}
                position={"relative"}
                _after={{
                  content: "''",
                  width: "full",
                  height: useBreakpointValue({ base: "20%", md: "30%" }),
                  position: "absolute",
                  bottom: 1,
                  left: 0,
                  bg: "blue.400",
                  zIndex: -1,
                }}
              >
                Hello,{" "}
              </Text>
              <Text color={"blue.400"} as={"span"}>
                {auth.user.name.split(" ")[0]}! 👋
              </Text>{" "}
            </Heading>
          </Stack>
        </Flex>
        <Flex flex={1}>
          <Image
            alt={"Login Image"}
            objectFit={"cover"}
            src={"/assets/banner.png"}
            maxW='300px'
          />
        </Flex>
      </Stack>
      <Grid templateColumns='repeat(2, 1fr)' gap={4} p={8}>
        <GridItem
          maxH='25em'
          overflow='auto'
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"lg"}
          p={8}
          rounded={"xl"}
          align={"center"}
          pos={"relative"}
          _after={{
            content: `""`,
            w: 0,
            h: 0,
            borderLeft: "solid transparent",
            borderLeftWidth: 16,
            borderRight: "solid transparent",
            borderRightWidth: 16,
            borderTop: "solid",
            borderTopWidth: 16,
            borderTopColor: useColorModeValue("white", "gray.800"),
            pos: "absolute",
            bottom: "-16px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Heading pt={5} pl={5} fontSize='2xl'>
            Recent Projects
          </Heading>
          <Box p={5}>
            {recentProjects.length > 0 ? (
              recentProjects.map((p) => (
                <ProjectRow
                  key={p._id}
                  name={p.name}
                  projid={p._id}
                  isFinished={p.isFinished}
                  dash
                />
              ))
            ) : (
              <>
                <Text>No recent projects...</Text>
                <Link to='/project'>Create project</Link>
              </>
            )}
          </Box>
        </GridItem>
        <GridItem
          overflow='auto'
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"lg"}
          p={8}
          rounded={"xl"}
          align={"center"}
          maxH='25em'
          pos={"relative"}
          _after={{
            content: `""`,
            w: 0,
            h: 0,
            borderLeft: "solid transparent",
            borderLeftWidth: 16,
            borderRight: "solid transparent",
            borderRightWidth: 16,
            borderTop: "solid",
            borderTopWidth: 16,
            borderTopColor: useColorModeValue("white", "gray.800"),
            pos: "absolute",
            bottom: "-16px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Heading pt={5} pl={5} fontSize='2xl'>
            Recent Files
          </Heading>
          <Box p={5}>
            {recentFiles.length > 0 ? (
              recentFiles.map((p) => (
                <Link to={"/myfiles"}>
                  <FileRow name={p.name} dash />
                </Link>
              ))
            ) : (
              <>
                <Text>No recent files...</Text>
                <CLink as={Link} to='/myfiles'>
                  Add File
                </CLink>
              </>
            )}
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
