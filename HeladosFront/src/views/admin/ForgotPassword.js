import React, { useState } from "react";
import {
  useHistory,
  useLocation,
  Link as ReactRouterLink
} from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  AlertDescription,
  CloseButton,
  Input,
  Stack,
  Button,
  CircularProgress,
  Heading,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const ForgotPassword = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");

  console.log("got token", token);

  const [authAlert, setAuthAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const history = useHistory();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsLoading(true);
    setShowPassword(false);

    const { password, confirmpassword } = values;
    try {
      console.log("got password", password, confirmpassword);
      //   await login(username, password);
      //   history.push("/login");
      setAuthAlert({
        status: "success",
        message: "Usuario o contraseña inválida",
      });
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setAuthAlert({
        status: "error",
        message: "Usuario o contraseña inválida",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        spacing={8}
        align={"center"}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
      >
        <Heading fontSize={"4xl"}>Restablecer contraseña</Heading>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          minW={"lg"}
        >
          <Box mb={3}>
            <Link
              as={ReactRouterLink}
              to={"/admin/login"}
              _hover={{
                color: useColorModeValue("purple.400", "purple.200"),
              }}
            >
              <ArrowBackIcon />
              Login
            </Link>
          </Box>
          {authAlert && (
            <Box my={4}>
              <Alert status={authAlert.status} borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{authAlert.message}</AlertDescription>
                <CloseButton
                  position="absolute"
                  right="8px"
                  top="8px"
                  onClick={() => setAuthAlert(null)}
                />
              </Alert>
            </Box>
          )}
          <Stack spacing={4}>
            <FormControl
              id="password"
              isInvalid={!!errors?.password?.message}
              errortext={errors?.password?.message}
            >
              <FormLabel>Nueva contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Ingresa la nueva contraseña",
                  })}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.5rem"
                    size="sm"
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="confirmpassword"
              isInvalid={!!errors?.confirmpassword?.message}
              errortext={errors?.confirmpassword?.message}
            >
              <FormLabel>Confirma contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmpassword", {
                    required: "Confirma la nueva contraseña",
                  })}
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.5rem"
                    size="sm"
                    onClick={handleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors?.confirmpassword?.message}
              </FormErrorMessage>
            </FormControl>
            <Stack spacing={10}>
              <Button
                bg={"purple.400"}
                color={"white"}
                _hover={{
                  bg: "purple.500",
                }}
                type={"submit"}
              >
                {isLoading ? (
                  <CircularProgress isIndeterminate size="24px" color="teal" />
                ) : (
                  "Restablecer contraseña"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
};

export default ForgotPassword;
