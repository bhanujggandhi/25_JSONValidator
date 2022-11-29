import {
  Avatar,
  Box,
  Center,
  Container,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import React from "react";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import SidebarContent from "./SidebarContent";
import { logoutUser } from "../../redux/actions/authActions";
import SocialButton from "./SocialButton";

const Sidebar = ({ children, auth, logoutUser }) => {
  const sidebar = useDisclosure();
  return (
    <Box
      as="section"
      bg="gray.700"
      _dark={{
        bg: "gray.700",
      }}
      minH="100vh"
    >
      <SidebarContent
        display={{
          base: "none",
          md: "unset",
        }}
      />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg="gray.800"
          _dark={{
            bg: "gray.800",
          }}
          borderBottomWidth="1px"
          borderColor="blackAlpha.300"
          h="14"
        >
          <IconButton
            aria-label="Menu"
            display={{
              base: "inline-flex",
              md: "none",
            }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <InputGroup
            w="96"
            display={{
              base: "none",
              md: "flex",
            }}
          ></InputGroup>
          {auth.isAuthenticated && (
            <Flex align="center">
              <Menu>
                <MenuButton>
                  <Avatar
                    ml="4"
                    size="sm"
                    name={auth.user.name}
                    cursor="pointer"
                  />
                </MenuButton>
                <MenuList>
                  <Link to="/profile">
                    <MenuItem icon={<FaUser />}>Profile</MenuItem>
                  </Link>
                  <MenuItem icon={<FaSignOutAlt />} onClick={logoutUser}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          )}
        </Flex>

        <Box as="main">{children}</Box>
      </Box>
      <Box
        bg={useColorModeValue("gray.50", "gray.900")}
        color={useColorModeValue("gray.700", "gray.200")}
      >
        {/* <Container
          as={Stack}
          maxW={"6xl"}
          py={4}
          spacing={4}
          justify={"center"}
          align={"center"}
        >
          <Image
            src='/assets/iiithlogo.png'
            bgColor={"gray.300"}
            maxW='20%'
            borderRadius={"10px"}
          />
        </Container> */}

        <Box
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Container
            as={Stack}
            maxW={"6xl"}
            py={4}
            direction={{ base: "column", md: "row" }}
            spacing={4}
            justify={{ base: "center", md: "space-between" }}
            align={{ base: "center", md: "center" }}
          >
            <Flex pl={{ base: "90px", md: "90px" }}>
              © 2022 IIIT Hyderabad. All rights reserved
            </Flex>
            <Stack direction={"row"} spacing={6} justify="flex-end">
              <SocialButton
                label={"Twitter"}
                href={"https://twitter.com/iiit_hyderabad"}
              >
                <FaTwitter />
              </SocialButton>
              <SocialButton
                label={"YouTube"}
                href={
                  "https://www.youtube.com/channel/UCzCMyBy0VRoQBF8x-TsXTnQ"
                }
              >
                <FaYoutube />
              </SocialButton>
              <SocialButton
                label={"Instagram"}
                href={"https://www.instagram.com/iiit.hyderabad/?hl=en"}
              >
                <FaInstagram />
              </SocialButton>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Sidebar);
