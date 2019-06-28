import { getRandomInt } from "./utils.js"

/**
 * orderbookStatusEnum, defining order status life cycle
 */
export const orderbookStatusEnum = {
    status: {
        REQUESTED: { displayName: "Requested", backgroundColor: "#575A57", color: "white"},
        WORKING: {displayName: "Working", backgroundColor: "white", color: "black"},
        PARTFILLED: {displayName: "PartFilled", backgroundColor: "#F3ED19", color: "black"},
        FILLED: {displayName: "Filled", backgroundColor: "#27B021", color: "white"},
        CANCELLED: {displayName: "Cancelled", backgroundColor: "#07A6FB", color: "white"},
        REJECTED: {displayName: "Rejected", backgroundColor: "#F92E05", color: "white"}
    },
    getRandomFinalOrderStatus: () => {
        const arrayorderbookStatusEnum = Object.keys(orderbookStatusEnum.status);
        const status = arrayorderbookStatusEnum[getRandomInt(0,arrayorderbookStatusEnum.length-1)];
        return orderbookStatusEnum.status[status];
    },
    getOrderStatus: displayName => {
        const status = Object.keys(orderbookStatusEnum.status).find(e => orderbookStatusEnum.status[e].displayName === displayName);
        return orderbookStatusEnum.status[status];
    }
}
