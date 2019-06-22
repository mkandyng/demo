import { getRandomInt } from "../../libs/utils.js"

export const orderbookStatus = {
    REQUESTED: { displayName: "Requested", backgroundColor: "#575A57", color: "white"},
    WORKING: {displayName: "Working", backgroundColor: "white", color: "black"},
    PARTFILLED: {displayName: "PartFilled", backgroundColor: "#F3ED19", color: "black"},
    FILLED: {displayName: "Filled", backgroundColor: "#27B021", color: "white"},
    CANCELLED: {displayName: "Cancelled", backgroundColor: "#07A6FB", color: "white"},
    REJECTED: {displayName: "Rejected", backgroundColor: "#F92E05", color: "white"},
    getRandomFinalOrderStatus: () => {
        const arrayOrderbookStatus = Object.keys(orderbookStatus);
        const status = arrayOrderbookStatus[getRandomInt(0,arrayOrderbookStatus.length-1)];
        return orderbookStatus[status];
    },
    getOrderStatus: displayName => {
        const status = Object.keys(orderbookStatus).find(enumVal => orderbookStatus[enumVal].displayName === displayName);
        return orderbookStatus[status];
    }
}
