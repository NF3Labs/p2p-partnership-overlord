import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useDisclosure,
  HStack,
  Stack,
  Skeleton,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { Bell } from "../Icons/Bell";
import { useAccount } from "wagmi";
import { NotificationItemNav } from "./NotificationItemNav";
import { MarkAllAsRead } from "./MarkAllAsRead";
import Link from "next/link";
import { useEffect } from "react";
import { CheckNotif } from "../Icons/CheckNotif";
import { createStandaloneToast } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { InfoNotif } from "../Icons/InfoNotif";
import { useRouter } from "next/router";
import { useUserContext } from "../../contexts/User";
import { FixedSizeList as ListBox } from "react-window";

export const NavNotification = ({ data, isMobile }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverBg = useColorModeValue("#F1F1F1", "#2A2142");
  const bg = useColorModeValue("white", "#1A1429");
  const borderTop = useColorModeValue("2px solid #F1F1F1", "2px solid #2A2142");
  const closeBg = useColorModeValue("rgba(91, 91, 91, 0.7)", "#403462");
  const billBg = useColorModeValue("#FFFFFF", "#FFFFFF");
  const color1 = useColorModeValue("black", "white");
  const color2 = useColorModeValue("white", "#696869");
  const color3 = useColorModeValue("#696869", "white");
  const color4 = useColorModeValue("#F1F1F1", "#2A2142");
  const color5 = useColorModeValue("white", "#1A1429");
  const bgTool = useColorModeValue("#FFFFFF", "#1A1429");
  const colorTool = useColorModeValue("black", "white");
  const borderTool = useColorModeValue(
    "1px solid #8C8C8C",
    "1px solid #C4C4D4"
  );
  const borderColorTool = useColorModeValue("#8C8C8C", "#C4C4D4");

  const border2 = useColorModeValue("1px solid #000000", "1px solid #403462");

  const { address } = useAccount();
  const { toast } = createStandaloneToast();
  const toastIdRef = useRef();
  const [list, setList] = useState([]);
  const [checked, setChecked] = useState(false);
  const close = () => {
    toast.closeAll();
  };
  const router = useRouter();
  const useContext = useUserContext();
  const addToast = (id, listingId, image, message) => {
    toastIdRef.current = toast({
      position: "top-right",
      render: () => (
        <HStack
          w="full"
          px="3"
          borderRadius={"8px"}
          borderTop={borderTop}
          p="2"
          justifyContent={"space-between"}
          align="start"
          bg={bg}
          onClick={() => {
            handleItem(id, listingId);
          }}
        >
          <HStack gap="1.5">
            <Box position="relative" ml="1">
              {!image ? (
                <Skeleton
                  isLoaded={false}
                  h="56px"
                  w="56px"
                  borderRadius={"8px"}
                />
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
                <InfoNotif />
              </Box>
            </Box>
            <Stack spacing="0" fontSize={"12px"}>
              <Box maxW="xs">{message ? message : ""}</Box>
              {/* <Link href={`/dashboard/active-options/${address}`}>
                <Box maxW="sm" color={"#ff0083"}>
                  View active option
                </Box>
              </Link> */}

              {/* <Box maxW="sm" color={"#ff0083"}>
                  View active option
                </Box> */}
            </Stack>
          </HStack>
          <Box>
            <CloseIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                close();
              }}
              fontSize="10px"
              mr="2"
              color={closeBg}
            />
          </Box>
        </HStack>
      ),
    });
  };

  const isSameUser = (a, b) =>
    a.id === b.id && a.is_delivered === b.is_delivered;

  const onlyInLeft = (left, right, compareFunction) => {
    return left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue))
    );
  };
  const handleMarkAllAsReadInDropDown = async () => {
    await useContext?.readNotification(-1, address);
    onList();
  };

  const onList = async () => {
    let temp = await useContext?.getNotifications();
    if (temp) {
      setList(temp.notifications);
    }
  };
  useEffect(() => {
    if (data && list && list.length !== 0) {
      const onlyInA = onlyInLeft(data.notifications, list, isSameUser);
      // const onlyInB = onlyInLeft(list, data.notifications, isSameUser);
      const result = [...onlyInA /* , ...onlyInB */];
      result.forEach((item) => {
        addToast(item.id, item.listing_id, item.image, item.description);
      });
    }
    if (data) {
      setList(data.notifications);
    }
  }, [data]);

  useEffect(() => {
    if (list?.length)
      setChecked(list?.filter((i) => i.is_delivered === false).length > 0);
  }, [list]);

  const handleItem = async (id, number) => {
    if (number) {
      router.push(`/token-listing/${number}`);
    }
    await useContext?.readNotification(id, address);
    onList();
  };

  const getNewNotificationList = (list) => {
    return list.filter((i) => i.is_delivered == false);
  };
  const Row = ({ index, style }) => (
    <Box p="0" _hover={{ bg: hoverBg }} background={bg} style={style}>
      <NotificationItemNav
        id={list && list[index].id}
        notificationId={list && list[index].listing_id}
        date={list && list[index].created_at}
        message={list && list[index].description}
        onClick={handleItem}
        image={list && list[index].image}
        isRead={list && list[index].is_delivered}
        redirect_url={list && list[index].redirect_url}
        icon={list && list[index].is_delivered ? <CheckNotif /> : ""}
      />
    </Box>
  );


  return (
    <Box>
      <Menu>
        <MenuButton display="flex">
          <Flex pos={"relative"}>
            <Bell width="23px" height="27px" fill={billBg} />
            {checked && (
              <Box
                bgColor="#FF0083"
                w="12px"
                h="12px"
                borderRadius="50%"
                pos={"absolute"}
                top={0}
                right={0}
              />
            )}
          </Flex>
        </MenuButton>
        <MenuList bg={bg} border={border2} borderRadius="4px" p="0" mt="30px">
          <Flex
            align="center"
            gap="12"
            px="4"
            pt="1"
            pb="4px"
            justifyContent={"space-between"}
          >
            <Box fontWeight={"bold"} fontSize="12px">
              New Notifications (
              {list ? getNewNotificationList(list).length : 0})
            </Box>
            <MarkAllAsRead onClick={handleMarkAllAsReadInDropDown} />
          </Flex>
          {list && (
            <ListBox
              width={426}
              height={
                getNewNotificationList(list).length * 74 < 500
                  ? getNewNotificationList(list).length * 74
                  : 500
              }
              itemCount={getNewNotificationList(list).length}
              itemSize={70}
            >
              {Row}
            </ListBox>
          )}
          <Link href={`/dashboard/notifications/${address}`}>
            <Box
              borderTop="2px solid"
              borderColor={color4}
              // textTransform="uppercase"
              color="#FF0083"
              fontWeight="bold"
              w="calc(100% - 4px)"
              textAlign="center"
              py="2"
              cursor="pointer"
              onClick={onClose}
              fontSize="12px"
              borderBottomRadius="8px"
              background={color5}
            >
              View all notifications
            </Box>
          </Link>
        </MenuList>
      </Menu>
    </Box>
  );
};
