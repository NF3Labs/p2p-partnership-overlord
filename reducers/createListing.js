export const initialCreateListingState = {
  nfts: [],
  fts: [],
  swapNow: [
    {
      index: 0,
      nfts: [],
      fts: [],
    },
  ],
  reserveNowSwapLater: [
    {
      index: 0,
      duration: 0,
      deposit: {
        nfts: [],
        fts: [],
      },
      remaining: {
        nfts: [],
        fts: [],
      },
    },
  ],
  interestedIn: {
    interested_nfts: [],
    interested_fts: [],
  },
  listingPeriod: 1, //time in hours
  addNFTSwapNow: false,
  addERC20SwapNow: false,
  addInterestedInNFT: false,
  addInterestedInERC20: false,
  nftState: 3,
  tokenState: 3,
};

export const createListing = (state, action) => {
  switch (action.type) {
    case "HANDLE_NFT":
      return {
        ...state,
        nfts: action.payload,
      };
    case "HANDLE_FT":
      return {
        ...state,
        fts: action.payload,
      };
    case "HANDLE_SWAP_NOW":
      return {
        ...state,
        swapNow: action.payload,
      };
    case "HANDLE_RESERVE_NOW_SWAP_LATER":
      return {
        ...state,
        reserveNowSwapLater: action.payload,
      };
    case "HANDLE_INTERESTED_IN":
      return {
        ...state,
        interestedIn: action.payload,
      };
    case "HANDLE_LISTING_PERIOD":
      return {
        ...state,
        listingPeriod: action.payload,
      };
    case "HANDLE_ADD_NFT_SWAP_NOW":
      return {
        ...state,
        addNFTSwapNow: action.payload,
      };
    case "HANDLE_ADD_ERC20_SWAP_NOW":
      return {
        ...state,
        addERC20SwapNow: action.payload,
      };
    case "HANDLE_ADD_INTERESTED_ERC20":
      return {
        ...state,
        addInterestedInERC20: action.payload,
      };
    case "HANDLE_ADD_INTERESTED_NFT":
      return {
        ...state,
        addInterestedInNFT: action.payload,
      };
    case "HANDLE_NFTSTATE_SET":
      return {
        ...state,
        nftState: action.payload,
      };
    case "HANDLE_TOKENSTATE_SET":
      return {
        ...state,
        tokenState: action.payload,
      };
    case "RESET":
      return {
        nfts: [],
        fts: [],
        swapNow: [
          {
            index: 0,
            nfts: [],
            fts: [],
          },
        ],
        reserveNowSwapLater: [
          {
            index: 0,
            duration: 0,
            deposit: {
              nfts: [],
              fts: [],
            },
            remaining: {
              nfts: [],
              fts: [],
            },
          },
        ],
        interestedIn: {
          interested_nfts: [],
          interested_fts: [],
        },
        listingPeriod: 720, //time in hours
        addNFTSwapNow: false,
        addERC20SwapNow: false,
        addInterestedInNFT: false,
        addInterestedInERC20: false,
        nftState: 3,
        tokenState: 3,
      };
    default:
      throw new Error();
  }
};
