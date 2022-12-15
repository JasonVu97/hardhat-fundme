// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    int constant ethConst = 1e18;
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint) {
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        (, int price,,,) = priceFeed.latestRoundData();
        return uint(price * ethConst);
    }

    // function getVersion() internal view returns(uint) {
    //     AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
    //     return priceFeed.version();
    // }

    function getConversionRate(uint ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint) {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUsd = (ethPrice * ethAmount) / uint(ethConst);
        return ethAmountInUsd;
    }
}