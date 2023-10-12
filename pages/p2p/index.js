import { useState, useEffect } from "react";
import { Flex } from "@chakra-ui/react";
import { CancelTrade } from "../../components/Modals/CancelTrade";
import { useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { Dashboard } from "../../components/P2p/Dashboard";
import { Progress } from "../../components/P2p/Progress";
import { useUserContext } from "../../contexts/User";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";

export default function P2p() {
  const [{ nextRoute, confirmed }, setNextRoute] = useState({
    nextRoute: null,
    confirmed: false,
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setOpen } = useModal();
  const stayHere = () => setNextRoute({ nextRoute: null, confirmed: false });
  const toNextRoute = () => setNextRoute({ nextRoute, confirmed: true });
  const router = useRouter();
  const userContext = useUserContext();
  const { address } = useAccount();

  const [status, setStatus] = useState(0);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const temp = window.sessionStorage.getItem("dashboard-p2p");
    if (temp) {
      setStatus(1);
      sessionStorage.removeItem("dashboard-p2p");
    }
  }, []);

  useEffect(() => {
    const onRouteChangeStart = (route) => {
      const isCompleteP2p = window.sessionStorage.getItem("p2p-complete");
      if (status === 0 || isCompleteP2p) {
        window.sessionStorage.removeItem("p2p-complete")
        return undefined;
      }
      setNextRoute({ nextRoute: route, confirmed: false });
      router.events.emit("routeChangeError");
      throw "Route change aborted due to unsaved changes.";
    };

    const cleanUpFunction = () => {
      router.events.off("routeChangeStart", onRouteChangeStart);
    };

    if (nextRoute && confirmed) {
      router.push(nextRoute);

      return cleanUpFunction;
    }

    router.events.on("routeChangeStart", onRouteChangeStart);

    return cleanUpFunction;
  }, [router, nextRoute, confirmed, status]);

  useEffect(() => {
    if (nextRoute && !isOpen) {
      if(tab !== 4)
        onOpen();
      else
      {
        setTab(0);
        handleContinue();
      }
    }
  }, [nextRoute, isOpen]);

  useEffect(() => {
    return () => {
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });
    };
  }, []);

  useEffect(() => {
    if(address && address !== window.localStorage.getItem("wallet-address")) {
      setStatus(0);
      userContext?.dispatchSelectedActions({
        type: "RESET",
      });
    }
  }, [address])

  const handleContinue = () => {
    if (nextRoute !== router.asPath) {
      onClose();
      toNextRoute();
    } else {
      stayHere();
      onClose();
      setStatus(0);
    }
  };

  const handleGoBack = () => {
    stayHere();
    onClose();
  };

  const handleNew = () => {
    if (address) {
      setStatus(1);
    } else {
      setOpen();
    }
  };

  const handleStatus = () => {
    setStatus(0);
  };

  return (
    <>
      {console.log("asdfg\n",status)}
      <CancelTrade
        isOpen={isOpen}
        onClose={onClose}
        handleContinue={handleContinue}
        handleGoBack={handleGoBack}
      />
      <Flex>
        {status === 0 ? (
          <Dashboard onTrade={handleNew} />
        ) : (
          <Progress callback={handleStatus} tab={tab} setTab={setTab}/>
        )}
      </Flex>
    </>
  );
}
