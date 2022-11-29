import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Tag,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { FaExclamationCircle } from "react-icons/fa";
import { BiDownload } from "react-icons/bi";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";

import isJson from "../../utils/checkjson";

let errors = [];

const tipcolors = {
  number: "orange",
  object: "green",
  boolean: "red",
  string: "yellow",
  array: "blue",
};

const jsonValidator = (grammar, validating) => {
  const grammarArray = Object.keys(grammar).filter(
    (value) => !Object.keys(validating).includes(value)
  );

  const extraEntries = Object.keys(validating).filter(
    (value) => !Object.keys(grammar).includes(value)
  );

  extraEntries.map((en) => {
    errors.push(`"${en}" is invalid key in the JSON`);
  });

  grammarArray.map((en) => {
    if (grammar[en].req === "mandatory") {
      errors.push(
        `"${en}" is a mandatory field! Please add the field with ${grammar[en].typeof} type`
      );
    }
  });

  const keys = Object.keys(grammar);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // If optional key is not present
    if (typeof validating[key] === "undefined") {
      continue;
    }

    // Handling nested objects recursively
    if (
      typeof validating[key] === "object" &&
      grammar[key].typeof === "object"
    ) {
      jsonValidator(grammar[key].k, validating[key]);
      continue;
    }

    if (typeof validating[key] !== grammar[key].typeof) {
      errors.push(
        ` "${key}" has an invalid type of '${typeof validating[
          key
        ]}'. Expected type of ${grammar[key].typeof}`
      );
    }

    if (
      typeof validating[key] === "string" &&
      typeof validating[key] === grammar[key].typeof &&
      grammar[key].req === "mandatory" &&
      validating[key].length === 0
    ) {
      errors.push(`"${key}" is mandatory, empty string is not allowed`);
    }
  }

  if (errors.length > 0) return true;

  return false;
};

const ProjectPageContent = ({
  stepslen,
  nextStep,
  prevStep,
  reset,
  activeStep,
  scene,
  action,
  asset,
  projectname,
}) => {
  const toast = useToast();
  const [files, setfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setdata] = useState("");
  const [grammarid, setGrammarid] = useState("");
  const [validated, setValidated] = useState(false);
  const [grammarData, setGrammarData] = useState({});
  const [displayErrors, setDisplayErrors] = useState([]);
  const [downloadable, setDownloadable] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { projectid } = useParams();

  const jwttoken = localStorage.getItem("jwtToken");
  const getfiles = async () => {
    let url = "";
    if (activeStep === 0) url = `http://localhost:5002/api/json/scene`;
    else if (activeStep === 1) url = `http://localhost:5002/api/json/scene`;
    else if (activeStep === 2) url = `http://localhost:5002/api/json/scene`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.get(url, requestOptions);

      setfiles(res.data);
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
      await getfiles();
      setLoading(false);
    };

    f();
  }, []);

  useEffect(() => {
    if (activeStep === 0) {
      setdata(scene);
      if (isJson(scene)) {
        setDownloadable(true);
      }
    }
    if (activeStep === 1) {
      setdata(asset);
      if (isJson(asset)) {
        setDownloadable(true);
      }
    }
    if (activeStep === 2) {
      setdata(action);
      if (isJson(action)) {
        setDownloadable(true);
      }
    }
  }, []);

  const downloadTxtFile = () => {
    if (data === "" || !isJson(data)) {
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setDownloadable(false);
      return;
    }
    let fileName = "";
    if (activeStep === 0) fileName = "scene";
    if (activeStep === 1) fileName = "asset";
    if (activeStep === 2) fileName = "action";
    const json = data;
    const blob = new Blob([json], { type: "application/json" });
    const href = URL.createObjectURL(blob);

    const downlink = document.createElement("a");
    downlink.href = href;
    downlink.download = projectname + "-" + fileName + ".json";
    document.body.appendChild(downlink);
    downlink.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(downlink);
    URL.revokeObjectURL(href);
  };

  const onValidate = async () => {
    if (!isJson(data)) {
      setValidated(false);
      setDownloadable(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    setDisplayErrors([]);
    errors = [];
    const myjson = JSON.parse(data);

    if (!jsonValidator(grammarData, myjson)) {
      setValidated(true);
      setDownloadable(true);
      toast({
        title: "JSON Validated Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } else {
      console.log(errors);
      toast({
        title: "There are errors in the entered JSON, please check them out!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
    setDisplayErrors(errors);
  };

  const onChangeFile = async (e) => {
    setGrammarid(e.target.value);
    if (!e.target.value) {
      setGrammarData({});
      return;
    }
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.get(
        `http://localhost:5002/api/json/${e.target.value}`,
        requestOptions
      );
      const grammarjson = JSON.parse(res.data.data);
      setGrammarData(grammarjson);
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

  const onNextStep = async () => {
    if (!isJson(data)) {
      setValidated(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSubmitting(true);
    let url = "";
    if (activeStep === 0)
      url = `http://localhost:5002/api/project/${projectid}/scene`;
    else if (activeStep === 1)
      url = `http://localhost:5002/api/project/${projectid}/asset`;
    else if (activeStep === 2)
      url = `http://localhost:5002/api/project/${projectid}/action`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.patch(url, { data }, requestOptions);

      toast({
        title: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
    setSubmitting(false);

    nextStep();
  };

  const onFinish = async () => {
    if (!isJson(data)) {
      setValidated(false);
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSubmitting(true);
    let url = "";
    if (activeStep === 0)
      url = `http://localhost:5002/api/project/${projectid}/scene`;
    else if (activeStep === 1)
      url = `http://localhost:5002/api/project/${projectid}/asset`;
    else if (activeStep === 2)
      url = `http://localhost:5002/api/project/${projectid}/action`;
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await Axios.patch(url, { data }, requestOptions);

      toast({
        title: res.data.message,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
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
    setSubmitting(false);
    onOpen();
  };

  return loading ? (
    <>
      <Flex
        width={"80vw"}
        height={"90vh"}
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
    <Grid templateColumns="repeat(6, 1fr)" gap={4}>
      <GridItem rowSpan={3} colSpan={1}>
        <Flex flexDir={"column"} pr={20} pt={120}>
          {Object.keys(grammarData).length > 0 ? (
            <>
              {Object.keys(grammarData).map((e, i) => (
                <Tooltip key={i} label={grammarData[e]["%comment%"]}>
                  <CustomCard
                    colorScheme={tipcolors[grammarData[e].typeof]}
                    variant={
                      grammarData[e].req === "mandatory" ? "solid" : "outline"
                    }
                    cursor="pointer"
                  >
                    {e}: {grammarData[e].typeof}
                  </CustomCard>
                </Tooltip>
              ))}
            </>
          ) : (
            <Flex
              flexDir={"row"}
              alignItems="center"
              minH="60vh"
              justifyContent={"center"}
              pl="50px"
            >
              Please select a grammar file to validate
            </Flex>
          )}
        </Flex>
      </GridItem>
      <GridItem rowSpan={3} colSpan={3}>
        <Flex py={4} alignItems={"center"} flexDir="column">
          <Select
            placeholder="Select Grammar File"
            py={4}
            maxW={80}
            onChange={onChangeFile}
            defaultValue={grammarid}
          >
            {files.map((file) => (
              <option key={file._id} value={file._id}>
                {file.name}
              </option>
            ))}
          </Select>
          <Flex>
            <AceEditor
              fontSize={16}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: false,
                showLineNumbers: true,
                tabSize: 2,
              }}
              mode="json"
              theme="terminal"
              onChange={(newvalue) => {
                setdata(newvalue);
                setDownloadable(false);
              }}
              value={data}
              name="grammar-editor"
              wrapEnabled
              height="40em"
              width={"40em"}
            />
          </Flex>
          <Stack py={4} direction="row">
            <Button
              colorScheme="yellow"
              disabled={!grammarid}
              onClick={onValidate}
            >
              Validate
            </Button>
            <Button
              colorScheme="green"
              disabled={!downloadable}
              onClick={downloadTxtFile}
              leftIcon={<BiDownload />}
            >
              Download File
            </Button>
          </Stack>

          {activeStep === stepslen ? (
            <Flex px={4} py={4} width="100%" flexDirection="column">
              <Heading fontSize="xl" textAlign="center">
                Woohoo! All steps completed!
              </Heading>
              <Button mx="auto" mt={6} size="sm" onClick={reset}>
                Reset
              </Button>
            </Flex>
          ) : (
            <Flex width="100%" justify="flex-end">
              <Button
                isDisabled={activeStep === 0}
                mr={4}
                onClick={prevStep}
                size="sm"
                variant={"outline"}
              >
                Prev
              </Button>

              {activeStep === stepslen - 1 ? (
                <Button
                  size="sm"
                  onClick={onFinish}
                  disabled={!validated || !grammarid}
                  isLoading={submitting}
                  colorScheme="green"
                  variant={"outline"}
                >
                  Finish
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onNextStep}
                  disabled={!validated || !grammarid}
                  isLoading={submitting}
                  colorScheme="yellow"
                  variant={"outline"}
                >
                  Next
                </Button>
              )}
            </Flex>
          )}
        </Flex>
      </GridItem>
      <GridItem rowSpan={3} colSpan={2} pt={120}>
        <Flex flexDir={"column"} pl={20}>
          {displayErrors.length > 0 ? (
            <List spacing={2}>
              {displayErrors.map((e, i) => {
                let str = "";
                const splitarr = e.match(/(?:[^\s"]+|"[^"]*")+/g);
                let Val;
                if (splitarr.length === 12) {
                  splitarr.map(
                    (m, i) => i !== 0 && i !== 10 && (str = str + " " + m)
                  );
                  Val = () => (
                    <>
                      <Text as="span">
                        <Text
                          as="span"
                          fontWeight={"bold"}
                          color={tipcolors[splitarr[10]]}
                        >
                          {splitarr[0]}
                        </Text>
                        <Text as="span">{str}</Text>
                        <Text
                          as="span"
                          fontWeight={"bold"}
                          color={tipcolors[splitarr[10]]}
                        >
                          {" " + splitarr[10]}
                        </Text>
                      </Text>
                    </>
                  );
                }

                if (splitarr.length === 7 || splitarr.length === 8) {
                  splitarr.map((m, i) => i !== 0 && (str = str + " " + m));
                  Val = () => (
                    <>
                      <Text as="span">
                        <Text as="span" fontWeight={"bold"} color={"teal.400"}>
                          {splitarr[0]}
                        </Text>
                        <Text as="span">{str}</Text>
                      </Text>
                    </>
                  );
                }

                if (splitarr.length === 11) {
                  splitarr.map(
                    (m, i) => i !== 0 && i !== 10 && (str = str + " " + m)
                  );
                  Val = () => (
                    <>
                      <Text as="span">
                        <Text
                          as="span"
                          fontWeight={"bold"}
                          color={tipcolors[splitarr[10]]}
                        >
                          {splitarr[0]}
                        </Text>
                        <Text as="span">{str}</Text>
                        <Text
                          as="span"
                          fontWeight={"bold"}
                          color={tipcolors[splitarr[10]]}
                        >
                          {" " + splitarr[10]}
                        </Text>
                      </Text>
                    </>
                  );
                }

                return (
                  <ListItem key={i}>
                    <ListIcon as={FaExclamationCircle} color="red.500" />
                    {<Val />}
                  </ListItem>
                );
              })}
            </List>
          ) : (
            <></>
          )}
        </Flex>
      </GridItem>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box textAlign="center" py={10} px={6}>
              <CheckCircleIcon boxSize={"50px"} color={"green.500"} />
              <Heading as="h2" size="xl" mt={6} mb={2}>
                JSON Validation Successful!
              </Heading>
              <Text color={"gray.500"}>
                We have made sure that your data is free from any data-types or
                syntax errors. Happy Development!
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

const CustomCard = React.forwardRef(({ children, ...rest }, ref) => (
  <Box p="1">
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  </Box>
));

export default ProjectPageContent;
