// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract SimpleStorage {
    uint favorNumbers;
    mapping(string => uint256) public nameToFavorNumbers;
    struct People {
        uint favorNumbers;
        string name;
    }
    People[] public people;
    function store(uint _favorNumbers) public virtual {
        favorNumbers = _favorNumbers;
    }

    function retrieve() public view returns(uint) {
        return favorNumbers;
    }

    function addPerson(string memory _name, uint _favorNumbers) public {
        // People memory person = People({ favorNumbers: _favorNumbers, name: _name });
        // people.push(person);
        people.push(People(_favorNumbers, _name));
        nameToFavorNumbers[_name] = _favorNumbers;
    }
}