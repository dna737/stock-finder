import Graph from "./Graph";
import PropTypes from "prop-types";

export default function DecideStockComponent({ ticker }) {
    if (isValidTicker(ticker)) {
        return <Graph ticker={ticker} />;
    }
    return <h1>lol no</h1>;
}

async function isValidTicker(ticker) {
    const allowedStocks = await fetch("./database_info.txt");
    const text = await allowedStocks.text();
    const validStocks = text.split("\n").map((stock) => stock.split(",")[1]);
    return validStocks.includes(ticker.toUpperCase());
}

DecideStockComponent.propTypes = {
    ticker: PropTypes.string,
};
