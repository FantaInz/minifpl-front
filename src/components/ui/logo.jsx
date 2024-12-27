import { HStack, Text } from "@chakra-ui/react";
import { IoIosFootball } from "react-icons/io";

const Logo = ({ size = "xl" }) => {
  const sizes = {
    sm: { text: "md", icon: "20px" },
    md: { text: "lg", icon: "30px" },
    lg: { text: "xl", icon: "40px" },
    xl: { text: "2xl", icon: "50px" },
    "2xl": { text: "3xl", icon: "60px" },
    "3xl": { text: "4xl", icon: "70px" },
    "4xl": { text: "5xl", icon: "80px" },
  };

  return (
    <HStack>
      <Text
        fontSize={sizes[size]?.text || "lg"}
        fontWeight="black"
        whiteSpace="nowrap"
      >
        MiniFPL
      </Text>
      <IoIosFootball size={sizes[size]?.icon || "40px"} />
    </HStack>
  );
};

export default Logo;
