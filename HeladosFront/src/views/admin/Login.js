import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
  Link,
  CloseButton,
  Input,
  Stack,
  Button,
  CircularProgress,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../../providers/AuthProvider";

const Login = () => {
  const { user, login } = useAuth();
  const [authAlert, setAuthAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const history = useHistory();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    setIsLoading(true);
    setShowPassword(false);

    const { username, password } = values;
    try {
      await login(username, password);
      history.push("/admin");
    }
    catch {
      setIsLoading(false);
      setAuthAlert({
        status: "error",
        message: "Usuario o contraseña inválida",
      });
    }
  };

  if (user) {
    history.push("/admin");
  }

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
        <Heading fontSize={"4xl"}>Iniciar sesión</Heading>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          minW={"lg"}
        >
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
              id="username"
              isInvalid={!!errors?.username?.message}
              errortext={errors?.username?.message}
            >
              <FormLabel>Usuario</FormLabel>
              <Input
                {...register("username", {
                  required: "Ingresa el nombre de usuario",
                })}
              />
              <FormErrorMessage>{errors?.username?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isInvalid={!!errors?.password?.message}
              errortext={errors?.password?.message}
            >
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Ingresa la contraseña",
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
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Link
                  color={"purple.400"}
                  onClick={() => history.push("/forgot-password")}
                >
                  ¿Olvidaste la contraseña?
                </Link>
              </Stack>
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
                  "Ingresar"
                )}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </form>
  );
};

export default Login;
