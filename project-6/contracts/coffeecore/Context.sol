// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        // silence warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        this;
        return msg.data;
    }
}