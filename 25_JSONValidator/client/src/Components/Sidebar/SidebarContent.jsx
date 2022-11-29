import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import NavItem from "./NavItem";
import { BsFiles } from "react-icons/bs";
import { FaProjectDiagram, FaRegUser, FaSignInAlt } from "react-icons/fa";
import { MdHelp, MdHome } from "react-icons/md";
import { VscFiles } from "react-icons/vsc";
import { connect } from "react-redux";
import { logoutUser } from "../../redux/actions/authActions";

const SidebarContent = (props) => (
  <Box
    as="nav"
    pos="fixed"
    top="0"
    left="0"
    zIndex="sticky"
    h="full"
    pb="10"
    overflowX="hidden"
    overflowY="auto"
    bg="gray.600"
    borderColor="blackAlpha.300"
    borderRightWidth="1px"
    w="60"
    {...props}
  >
    <Flex px="4" py="5" align="center">
      <Text fontSize="2xl" ml="2" color="white" fontWeight="semibold">
        ValiJSON
      </Text>
    </Flex>
    <Flex
      direction="column"
      as="nav"
      fontSize="md"
      color="gray.600"
      aria-label="Main Navigation"
    >
      {props.auth.isAuthenticated ? (
        <>
          <NavItem icon={MdHome} to="/dashboard">
            Home
          </NavItem>
          <NavItem icon={FaProjectDiagram} to="/projects">
            Projects
          </NavItem>
          <NavItem icon={BsFiles} to="/myfiles">
            My Files
          </NavItem>
          <NavItem icon={VscFiles} to="/allfiles">
            All Files
          </NavItem>
        </>
      ) : (
        <>
          <NavItem icon={FaSignInAlt} to="/login">
            Login
          </NavItem>
          <NavItem icon={FaRegUser} to="/register">
            Register
          </NavItem>
        </>
      )}
      <NavItem icon={MdHelp} to="/help">
        Help
      </NavItem>
    </Flex>
  </Box>
);

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(SidebarContent);
