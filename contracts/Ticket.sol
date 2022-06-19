//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "hardhat/console.sol";

contract Ticket {
    uint256 public funds;
    address public manager;
    address payable[] public participants;

    function init(address _manager) external {
        manager = _manager;
    }

    function getManager() external view returns (address) {
        return manager;
    }

    function getFund() external view returns (uint256) {
        return funds;
    }

    function getParticipants()
        external
        view
        returns (address payable[] memory)
    {
        return participants;
    }

    function buyTicket(uint256 value, address sender) external payable {
        require(value > 0 ether);
        funds += value;
        participants.push(payable(sender));
    }

    function random(address sender) private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(sender, block.timestamp)));
    }

    function pickWinner(address sender) external {
        require(sender == manager);
        uint256 randomIndex = random(sender) % participants.length;
        funds = funds / 2;
        payable(participants[randomIndex]).send(funds);
        console.log("First winner ", participants[randomIndex]);

        removeItem(randomIndex);

        randomIndex = random(sender) % participants.length;
        payable(participants[randomIndex]).send(funds);
        console.log("Second winner ", participants[randomIndex]);
        participants = new address payable[](0);
    }

    function removeItem(uint256 index) private {
        require(index < participants.length);
        participants[index] = participants[participants.length - 1];
        participants.pop();
    }
}
