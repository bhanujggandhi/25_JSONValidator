import axios from "axios";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Switch,
  useToast,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-terminal";
import { FaSave } from "react-icons/fa";
import { useHistory, useParams, Link } from "react-router-dom";

import isJson from "../../utils/checkjson";

const EditFile = () => {
  const [filename, setfilename] = useState("");
  const [data, setdata] = useState("");
  const [loading, setLoading] = useState(false);
  const [grammarfor, setGrammarfor] = React.useState("scene");
  const [privateFile, setPrivateFile] = useState(false);

  const history = useHistory();
  const toast = useToast();
  let { fileid } = useParams();

  const fetchdata = async () => {
    const jwttoken = localStorage.getItem("jwtToken");
    setLoading(true);
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      const res = await axios.get(
        `http://localhost:5002/api/json/${fileid}`,
        requestOptions
      );
      setdata(res.data.data);
      setfilename(res.data.name);
      setGrammarfor(res.data.grammarfor);
      setPrivateFile(res.data.private);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchdata();
  }, []);

  function onChange(newValue) {
    setdata(newValue);
  }

  const submitform = async () => {
    if (!isJson(data)) {
      toast({
        title: "JSON Syntax is not correct",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    const jwttoken = localStorage.getItem("jwtToken");
    setLoading(true);
    try {
      const requestOptions = {
        headers: { "Content-Type": "application/json", token: jwttoken },
      };
      console.log(privateFile);
      await axios.patch(
        `http://localhost:5002/api/json/${fileid}`,
        { data, name: filename, grammarfor, private: privateFile },
        requestOptions
      );
      history.push("/myfiles");
      setLoading(false);
      toast({
        title: "File updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
    }
  };

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
    <Box minH={"85vh"}>
      <Breadcrumb
        spacing="8px"
        pt={5}
        pl={5}
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink as={Link} to="/myfiles">
            My Files
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{filename}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Flex
        flexDir={"column"}
        justifyContent={"center"}
        alignItems="center"
        py="50px"
      >
        <Flex
          boxShadow={"xl"}
          p={8}
          rounded={"xl"}
          align={"center"}
          borderWidth={"1px"}
          borderColor="gray.400"
          mb={5}
        >
          <Flex justifyContent="center" flexDir={"column"}>
            <Box p="2">
              <Input
                colorScheme="yellow"
                placeholder="File Name"
                isRequired
                onChange={(e) => setfilename(e.target.value)}
                value={filename}
              />
            </Box>
            <RadioGroup onChange={setGrammarfor} value={grammarfor} py={2}>
              <Stack direction="row">
                <Radio value="scene">Scene</Radio>
                <Radio value="asset">Asset</Radio>
                <Radio value="action">Action</Radio>
              </Stack>
            </RadioGroup>
            <FormControl display="flex" justifyContent="center" pb={2}>
              <FormLabel htmlFor="public-file" mb="0">
                Private
              </FormLabel>
              <Switch
                id="public-file"
                defaultChecked={privateFile}
                onChange={() => {
                  setPrivateFile(!privateFile);
                }}
              />
            </FormControl>
          </Flex>
        </Flex>

        <Box mx={"40px"}>
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
            onChange={onChange}
            value={data}
            name="grammar-editor"
            wrapEnabled
            height="40em"
            width="60em"
          />
        </Box>
        <Center minW="max-content" justifyContent={"center"} my={"20px"}>
          <Button
            leftIcon={<FaSave />}
            colorScheme="yellow"
            disabled={!filename || !data}
            onClick={submitform}
            isLoading={loading}
          >
            Save File
          </Button>
        </Center>
      </Flex>
    </Box>
  );
};

export default EditFile;
