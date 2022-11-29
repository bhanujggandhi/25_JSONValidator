import React from "react";
import { Link } from "react-router-dom";
import { Heading, Text, Button, Center } from "@chakra-ui/react";

export default function NotFound() {
  return (
    <Center flexDir={"column"} textAlign="center" py={10} px={6} minH="85vh">
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, yellow.400, yellow.600)"
        backgroundClip="text"
      >
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={"gray.500"} mb={6}>
        The page you're looking for does not seem to exist
      </Text>

      <Button
        as={Link}
        to="/dashboard"
        colorScheme="yellow"
        bgGradient="linear(to-r, yellow.400, yellow.500, yellow.600)"
        color="white"
        variant="solid"
      >
        Go to Home
      </Button>
    </Center>
  );
}
