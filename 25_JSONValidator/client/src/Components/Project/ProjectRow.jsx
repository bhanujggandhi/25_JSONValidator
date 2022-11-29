import React from "react";
import {
  Box,
  Button,
  Flex,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import JSZip from "jszip";
import { BiDownload } from "react-icons/bi";

function ProjectRow(props) {
  const {
    name,
    organization,
    owner,
    projid,
    isFinished,
    action,
    asset,
    scene,
    dash,
  } = props;

  let bgColor = useColorModeValue("gray.200", !dash ? "gray.800" : "gray.600");

  const nameColor = useColorModeValue("gray.900", "white");

  const downloadzip = () => {
    var zip = new JSZip();
    const scenejson = JSON.parse(scene);
    const actionjson = JSON.parse(action);
    const assetjson = JSON.parse(asset);
    zip.folder(name).file("scene.json", JSON.stringify(scenejson, null, 2));
    zip.folder(name).file("action.json", JSON.stringify(actionjson, null, 2));
    zip.folder(name).file("asset.json", JSON.stringify(assetjson, null, 2));
    zip.generateAsync({ type: "blob" }).then(function (content) {
      const href = URL.createObjectURL(content);

      const link = document.createElement("a");
      link.href = href;
      link.download = name + ".zip";
      document.body.appendChild(link);
      link.click();

      // clean up "a" element & remove ObjectURL
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    });
  };

  return (
    <Box p="24px" bg={bgColor} my="15px" borderRadius="12px">
      <Flex justify="space-between" w="100%">
        <Flex direction="column" maxWidth="70%">
          <Text
            as={Link}
            to={`/projects/${projid}`}
            color={nameColor}
            fontSize="md"
            fontWeight="bold"
            mb="10px"
          >
            {name}
          </Text>
          {owner && (
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              Owner Name:{" "}
              <Text as="span" color="gray.600">
                {owner}
              </Text>
            </Text>
          )}
          {organization && (
            <Text color="gray.500" fontSize="sm" fontWeight="semibold">
              Organization:{" "}
              <Text as="span" color="gray.600">
                {organization}
              </Text>
            </Text>
          )}
        </Flex>
        <Flex flexDir={"column"}>
          <Box>
            {isFinished ? (
              <Tag size={"md"} variant="solid" colorScheme="green">
                Completed
              </Tag>
            ) : (
              <Tag size={"md"} variant="solid" colorScheme="yellow">
                Pending
              </Tag>
            )}
          </Box>
          {isFinished && !dash && (
            <Box pt={3}>
              <Button size="sm" onClick={downloadzip} leftIcon={<BiDownload />}>
                Zip
              </Button>
            </Box>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

export default ProjectRow;
