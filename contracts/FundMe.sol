// Get fund from users
// Withdraw funds
// Set a minimum funding value in USD
// SPDX-License-Identifier: MIT

// Pragma
pragma solidity ^0.8.0;
// Import
import "./PriceConverter.sol";

// Error Codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts
/** @title A contract for crowd funding
 *  @author Minh Vu
 *  @notice This contract is to demo a sample funding contract
 *  @dev This implements price feeds as our library
 */
contract FundMe {
    // Type Declarations
    using PriceConverter for uint;

    // State Variables
    uint public constant minimumUsd = 50 * 1e18;

    address[] private s_funders;
    mapping(address => uint) private s_amountOfFunder;

    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    // Modifiers
    modifier onlyOwner {
        // require(msg.sender == owner, "Unauthorize!");
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }
    
    function fund() public payable {
        // Want to be able to set a minimum fund amount in USD
        // 1. How do we send ETH to this contract
        require(msg.value.getConversionRate(s_priceFeed) >= minimumUsd, "Didn't send enough!");
        s_funders.push(msg.sender);
        s_amountOfFunder[msg.sender] = msg.value;
    }

    function withdraw() public payable onlyOwner {
        for (uint funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
            s_amountOfFunder[s_funders[funderIndex]] = 0;
        }
        // reset array
        s_funders = new address[](0);
        // actually withdraw the funds

        // transfer

        // msg.sender = address
        // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);

        // send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        for (uint funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            s_amountOfFunder[funders[funderIndex]] = 0;
        }
        // reset array
        s_funders = new address[](0);
        // actually withdraw the funds

        // transfer

        // msg.sender = address
        // payable(msg.sender) = payable address
        payable(msg.sender).transfer(address(this).balance);

        // send
        bool sendSuccess = payable(msg.sender).send(address(this).balance);
        require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        require(callSuccess, "Call failed");
    }

    function getOwner() public view returns(address) {
        return i_owner;
    }

    function getFunder(uint index) public view returns(address) {
        return s_funders[index];
    }

    function getAmountOfFunder(address funder) public view returns(uint) {
        return s_amountOfFunder[funder];
    }

    function getPriceFeed() public view returns(AggregatorV3Interface) {
        return s_priceFeed;
    }
}