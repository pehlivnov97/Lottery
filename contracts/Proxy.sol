//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "./Ticket.sol";
import "hardhat/console.sol";

interface ITicket {
    function getManager() external view returns (address);

    function getFund() external view returns (uint256);

    function init(address _manager) external;

    function getParticipants() external returns (address payable[] memory);

    function buyTicket(uint256 value, address sender) external payable;

    function pickWinner(address addr) external;
}

contract Proxy {
    function callInit(address addr, address manager) external {
        ITicket(addr).init(manager);
    }

    function callManager(address addr) external view returns (address) {
        return ITicket(addr).getManager();
    }

    function callGetParticipants(address addr)
        external
        returns (address payable[] memory)
    {
        return ITicket(addr).getParticipants();
    }

    function callGetFund(address addr) external view returns (uint256) {
        return ITicket(addr).getFund();
    }

    function callBuyTicket(address addr) external payable {
        ITicket(addr).buyTicket(msg.value, msg.sender);
    }

    function callPickWinner(address addr) external {
        ITicket(addr).pickWinner(msg.sender);
    }
}
