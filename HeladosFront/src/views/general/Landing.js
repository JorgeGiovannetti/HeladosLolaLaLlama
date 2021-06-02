import React from "react";
import {
  VStack,
  Text,
  Link,
  useColorModeValue,
  Center,
  Spacer,
  Box,
  Flex,
} from "@chakra-ui/react";
import Navbar from "../../components/general/Navbar";

const Landing = () => {
  return (
      <Flex minH={"100vh"} w={"100%"} direction={"column"} align={"center"} justify={"center"}>
      <Navbar home />
        <VStack justify={"center"}>
          <Text
            mx={48}
            bgGradient="linear(to-l,pink.200,yellow.200,green.200)"
            bgClip="text"
            fontSize="8xl"
            fontWeight="extrabold"
          >
            Helados Lola La Llama
          </Text>
          <Text my={48} fontWeight={"light"} fontSize="xl">
            Helados 100% artesanales hechos en Tlaxcala 🇲🇽
          </Text>
          <Spacer />
          <Link
            m={8}
            rounded={"md"}
            _hover={{
              textDecoration: "none",
            }}
            href={"/Products"}
            color={"white"}
            colorScheme={"black"}
          >
            <Center
              bg={useColorModeValue("gray.800", "gray.800")}
              borderRadius="md"
              w={"64"}
              padding={"4"}
              justifyContent={"center"}
            >
              <Text fontSize={"lg"} fontWeight={"bold"}>
                COMPRAR HELADOS
              </Text>
            </Center>
          </Link>
        </VStack>
      </Flex>
  );
};

export default Landing;
