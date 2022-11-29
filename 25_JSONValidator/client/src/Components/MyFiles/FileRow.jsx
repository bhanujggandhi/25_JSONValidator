import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
} from "@chakra-ui/react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function FileRow(props) {
  const { name, organization, owner, jsonid, data, setdata, dash, own } = props;
  const toast = useToast();
  const textColor = useColorModeValue("gray.700", "white");
  const bgColor = useColorModeValue("#F8F9FA", !dash ? "gray.800" : "gray.600");
  const nameColor = useColorModeValue("gray.500", "white");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [loading, setLoading] = useState(false);

  const ondelete = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    setLoading(true);
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      await axios.delete(
        `http://localhost:5002/api/json/${jsonid}`,
        requestOptions
      );
      setdata(data.filter((d) => d._id !== jsonid));
      toast({
        title: "File deleted successfully",
        status: "success",
        duration: 10000,
        isClosable: true,
        position: "top-right",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 10000,
        isClosable: true,
        position: "top",
      });
      console.log(error);
      setLoading(false);
      onClose();
    }
  };

  return (
    <Box p="24px" bg={bgColor} my="15px" borderRadius="12px">
      <Flex justify="space-between" w="100%">
        <Flex direction="column" maxWidth="70%">
          <Text color={nameColor} fontSize="md" fontWeight="bold" mb="10px">
            {name}
          </Text>
          {!dash && (
            <>
              <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                Owner Name:{" "}
                <Text as="span" color="gray.500">
                  {owner}
                </Text>
              </Text>
              <Text color="gray.400" fontSize="sm" fontWeight="semibold">
                Organization:{" "}
                <Text as="span" color="gray.500">
                  {organization}
                </Text>
              </Text>
            </>
          )}
        </Flex>
        {!dash && own && (
          <>
            <Flex
              direction={{ sm: "column", md: "row" }}
              align="flex-start"
              p={{ md: "24px" }}
            >
              <Button
                p="0px"
                bg="transparent"
                mb={{ sm: "10px", md: "0px" }}
                me={{ md: "12px" }}
              >
                <Flex
                  color="red.500"
                  cursor="pointer"
                  align="center"
                  p="12px"
                  onClick={onOpen}
                >
                  <Icon as={FaTrashAlt} me="4px" />
                  <Text fontSize="sm" fontWeight="semibold">
                    DELETE
                  </Text>
                </Flex>
              </Button>
              <Button
                as={Link}
                p="0px"
                bg="transparent"
                to={`/myfiles/${jsonid}`}
              >
                <Flex
                  color={textColor}
                  cursor="pointer"
                  align="center"
                  p="12px"
                >
                  <Icon as={FaPencilAlt} me="4px" />
                  <Text fontSize="sm" fontWeight="semibold">
                    EDIT
                  </Text>
                </Flex>
              </Button>
            </Flex>
          </>
        )}
      </Flex>
      {!dash && (
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete JSON File
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={ondelete}
                  ml={3}
                  isLoading={loading}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      )}
    </Box>
  );
}

export default FileRow;
