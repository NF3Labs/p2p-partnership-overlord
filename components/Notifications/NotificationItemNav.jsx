import {
  HStack,
  Box,
  Stack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { InfoNotif } from "../Icons/InfoNotif";
import { getTimeFromSecondsString } from "../../utils/formatters";

export const NotificationItem = (props, isMobile) => {
  const {
    id,
    address,
    callback,
    date,
    notificationId,
    icon,
    image,
    message,
    timeNotified,
    isRead,
    l_id,
    onClick,
  } = props;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const menuBtnColor = useColorModeValue("black", "#C4C4D4");
  const cardBorder = useColorModeValue(
    "2px solid #000000",
    "2px solid #ffffff"
  );
  const bg = useColorModeValue("#FFF", "#2A2142");
  const color = useColorModeValue("rgba(91, 91, 91, 0.7)", "#403462");
  const borderColor = useColorModeValue("black", "white");
  const background = useColorModeValue("white", "#1A1429");
  const bghover = useColorModeValue("#F1F1F1", "#2A2142");
  const getTimeDifference = (date) => {
    let currentTime = new Date();
    const startTime = new Date(currentTime.toISOString());
    const endTime = new Date(date);
    const timeDiff = startTime.getTime() - endTime.getTime();
    const time = getTimeFromSecondsString(timeDiff / 1000);

    if (time.days > 0) return time.days + "d ago";
    if (time.hrs > 0) return time.hrs + "h ago";
    if (time.mins > 0) return time.mins + "m ago";
    if (time.secs > 0) return "Now";
    return time;
  };

  const handleMenu = (type, isRead) => {
    callback(type, isRead, id);

    onClose();
  };

  if (isMobile) {
    return (
      <HStack
        bg={bg}
        w="full"
        // maxW="4xl"
        // width="680px"
        borderRadius={"4px"}
        // border={useColorModeValue("2px solid #F1F1F1", "2px solid #2A2142")}
        py="8px"
        px="12px"
        justifyContent={"space-between"}
        align="start"
        onMouseLeave={onClose}
        onClick={() => onClick(id, l_id)}

      // _hover={{border: l_id ?  cardBorder : '', cursor: l_id ? "pointer" : ""}}
      >
        <HStack gap="1.5" opacity={isRead ? ".5" : "1"}>
          <Box position="relative" ml="1">
            {!image ? (
              <Skeleton isLoaded={false} h="56px" w="56px" borderRadius={"8px"} />
            ) : (
              <Box
                bgImage={image ? image : ""}
                h="40px"
                w="40px"
                borderRadius={"4px"}
                style={{ backgroundSize: "contain" }}
              />
            )}
            <Box position="absolute" top="-5px" left="-5px">
              {icon ? icon : <InfoNotif />}
            </Box>
          </Box>
          <Flex direction="column" justify="space-between" height="45px">
            <Box maxW="xl" fontSize={"10px"}>
              {message
                ? message
                : "An item you made an offer on, has received another offer"}
            </Box>
            <Box
              mt="3px"
              fontSize={"10px"}
              maxW="sm"
              color={color}
            >
              {date ? getTimeDifference(date) : ""}
            </Box>
          </Flex>
        </HStack>
        <Box>
          <Menu isOpen={isOpen} placement="bottom-end">
            <MenuButton
              as={IconButton}
              p="0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isOpen) {
                  onClose();
                } else {
                  onOpen();
                }
              }}
              background={isOpen ? "white" : "transparent"}
              _hover={{ bg: "" }}
              _focus={{ bg: "transparent" }}
              icon={
                <IoEllipsisHorizontal
                  // color={isOpen ? "white" : menuBtnColor}
                  fontSize="12px"
                  color="#8C8C8C"
                />
              }
              sx={{
                "&[data-active]": {
                  background: "white",
                },
              }}
            />
            <MenuList
              onMouseLeave={onClose}
              border="1px solid"
              borderColor={borderColor}
              background={background}
              py="8px"
              fontSize="10px"
            >
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(1, isRead);
                }}
              >
                {`Mark as ${isRead ? "unread" : "read"}`}
              </MenuItem>
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(2);
                }}
              >
                Remove notification
              </MenuItem>
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(3);
                }}
              >
                Report
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    );
  }
  else {
    return (
      <HStack
        bg={bg}
        w="full"
        maxW="4xl"
        width="680px"
        px="3"
        borderRadius={"8px"}
        // border={useColorModeValue("2px solid #F1F1F1", "2px solid #2A2142")}
        p="2"
        justifyContent={"space-between"}
        align="start"
        onMouseLeave={onClose}
        onClick={() => onClick(id, l_id)}

      // _hover={{border: l_id ?  cardBorder : '', cursor: l_id ? "pointer" : ""}}
      >
        <HStack gap="1.5" opacity={isRead ? ".5" : "1"}>
          <Box position="relative" ml="1">
            {!image ? (
              <Skeleton isLoaded={false} h="56px" w="56px" borderRadius={"8px"} />
            ) : (
              <Box
                bgImage={image ? image : ""}
                h="56px"
                w="56px"
                borderRadius={"8px"}
                style={{ backgroundSize: "contain" }}
              />
            )}
            <Box position="absolute" top="-5px" left="-5px">
              {icon ? icon : <InfoNotif />}
            </Box>
          </Box>
          <Flex direction="column" justify="space-between" height="56px">
            <Box maxW="xl" fontSize={"12px"}>
              {message
                ? message
                : "An item you made an offer on, has received another offer"}
            </Box>
            <Box
              mt="5px"
              fontSize={"12px"}
              maxW="sm"
              color={color}
            >
              {date ? getTimeDifference(date) : ""}
            </Box>
          </Flex>
        </HStack>
        <Box>
          <Menu isOpen={isOpen} placement="bottom-end">
            <MenuButton
              as={IconButton}
              p="0"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                if (isOpen) {
                  onClose();
                } else {
                  onOpen();
                }
              }}
              background={isOpen ? "white" : "transparent"}
              _hover={{ bg: "" }}
              _focus={{ bg: "transparent" }}
              icon={
                <IoEllipsisHorizontal
                  // color={isOpen ? "white" : menuBtnColor}
                  fontSize="22px"
                  color="#8C8C8C"
                />
              }
              sx={{
                "&[data-active]": {
                  background: "white",
                },
              }}
            />
            <MenuList
              onMouseLeave={onClose}
              border="1px solid"
              borderColor={borderColor}
              background={background}
              py="1"
            >
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(1, isRead);
                }}
              >
                {`Mark as ${isRead ? "unread" : "read"}`}
              </MenuItem>
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(2);
                }}
              >
                Remove notification
              </MenuItem>
              <MenuItem
                _hover={{ bg: bghover }}
                background={background}
                fontWeight="bold"
                py="1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMenu(3);
                }}
              >
                Report
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </HStack>
    );
  }
};
