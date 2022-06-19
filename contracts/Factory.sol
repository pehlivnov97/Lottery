//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;
import "./Proxy.sol";

contract Factory {
    Proxy[] public proxies;

    function createProxy() public {
        Proxy proxy = new Proxy();
        proxies.push(proxy);
    }

    function getProxy() public view returns (Proxy[] memory) {
        return proxies;
    }
}
