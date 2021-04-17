import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "../../providers/AuthProvider";

const Links = ["Dashboard", "Products", "Orders"];

const NavLink = ({ link, children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("purple.500", "purple.700"),
    }}
    href={`/admin/${link}`}
    color={"white"}
    fontWeight="semibold"
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("Logged out!");
      })
      .catch((e) => console.log("error", e));
  };

  return (
    <Box position={"fixed"} top={"0"} left={"0"}>
      <Box
        bg={useColorModeValue("purple.400", "purple.900")}
        px={4}
        minW={"100vw"}
      >
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            colorScheme="purple"
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: !isOpen ? "none" : "inherit" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link} link={link}>
                  {link}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
              >
                <Avatar size={"sm"} border={"2px"} color={"white"} />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </Box>
  );
};

export default Navbar;
