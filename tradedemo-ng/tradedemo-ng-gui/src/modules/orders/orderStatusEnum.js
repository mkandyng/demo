import {
  getRandomInt
} from "../../libs/utils.js"

/**
 * orderStatusEnum, defining order status life cycle
 */
export const orderStatusEnum = {
  status: {
    REQUESTED: {
      displayName: "Requested",
      backgroundColor: "#575A57",
      color: "white"
    },
    WORKING: {
      displayName: "Working",
      backgroundColor: "white",
      color: "black"
    },
    PARTFILLED: {
      displayName: "PartFilled",
      backgroundColor: "#F3ED19",
      color: "black"
    },
    FILLED: {
      displayName: "Filled",
      backgroundColor: "#27B021",
      color: "white"
    },
    CANCELLED: {
      displayName: "Cancelled",
      backgroundColor: "#07A6FB",
      color: "white"
    },
    REJECTED: {
      displayName: "Rejected",
      backgroundColor: "#F92E05",
      color: "white"
    }
  },
  getRandomFinalOrderStatus: () => {
    const arrayorderStatusEnum = Object.keys(orderStatusEnum.status);
    const status = arrayorderStatusEnum[getRandomInt(0, arrayorderStatusEnum.length - 1)];
    return orderStatusEnum.status[status];
  },
  getOrderStatus: displayName => {
    const status = Object.keys(orderStatusEnum.status).find(e => orderStatusEnum.status[e].displayName === displayName);
    return orderStatusEnum.status[status];
  }
}
