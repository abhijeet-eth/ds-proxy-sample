// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Sample {

    uint x = 10;

    function setX(uint _x) public {
        x = _x;
    }

    function getX() public view returns(uint) {
        return x;
    }

}

