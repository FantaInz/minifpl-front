import React from "react";
import {
  Box,
  Flex,
  Stack,
  Separator,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import NavLinkItem from "./nav-link-item";
import { CloseButton } from "@/components/ui/close-button";
import { LogoutButton } from "@/components/ui/logout-button";
import Logo from "@/components/ui/logo";
import LanguageSwitcher from "@/components/ui/language-switcher";
import { paths } from "@/config/paths";
import { useLogout } from "@/lib/auth";
import { Collapsible } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const NavBar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const logout = useLogout();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    localStorage.clear();
    queryClient.clear();
    await logout.mutateAsync();
  };

  const Links = [
    { name: t("navbar.solver"), path: paths.app.solver.path },
    { name: t("navbar.plans"), path: paths.app.plans.path },
    { name: t("navbar.predictions"), path: paths.app.predictions.path },
  ];

  return (
    <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        <Box>
          <Logo />
        </Box>

        <HStack
          spacing={8}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          {Links.map((link) => (
            <NavLinkItem
              key={link.name}
              to={link.path}
              data-testid={`nav-${link.name.toLowerCase()}-desktop`}
            >
              {link.name}
            </NavLinkItem>
          ))}
        </HStack>

        <Flex
          alignItems="center"
          display={{ base: "none", md: "flex" }}
          gap={4}
        >
          <LanguageSwitcher />
          <LogoutButton onClick={handleLogout} />
        </Flex>

        <Flex display={{ base: "flex", md: "none" }} ml={2}>
          {isOpen ? (
            <CloseButton onClick={toggleMenu} aria-label="Close menu" />
          ) : (
            <Button
              onClick={toggleMenu}
              variant="ghost"
              p={2}
              aria-label="Open menu"
            >
              <GiHamburgerMenu size={24} />
            </Button>
          )}
        </Flex>
      </Flex>

      <Collapsible.Root open={isOpen && isMobile}>
        <Collapsible.Content>
          <Stack bg="white" p={4} spacing={4}>
            <Box pt={4} width="100%" display="flex" justifyContent="center">
              <LanguageSwitcher />
            </Box>
            {Links.map((link) => (
              <React.Fragment key={link.name}>
                <NavLinkItem
                  to={link.path}
                  data-testid={`nav-${link.name.toLowerCase()}-mobile`}
                >
                  {link.name}
                </NavLinkItem>
                <Separator />
              </React.Fragment>
            ))}
            <Box pt={4} width="100%" display="flex" justifyContent="center">
              <LogoutButton
                onClick={handleLogout}
                maxW="200px"
                data-testid="logout-button"
              />
            </Box>
          </Stack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

export default NavBar;
