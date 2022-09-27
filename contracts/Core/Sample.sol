// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sample {

    event Logs(address sender);

    uint x = 10;

    function setX(uint _x) public {
        x = _x;
        emit Logs(msg.sender);
    }

    function getX() public view returns(uint) {
        return x;
    }

}
