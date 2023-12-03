import PropTypes from "prop-types";
import {
    Legend,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";

export default function Graph({ ticker = "AAPL" }) {
    // return <h2 className="text-5xl"></h2>;
    const [graphInfo, setGraphInfo] = useState([]);
    const [extremes, setExtremes] = useState({});

    const url =
        import.meta.env.VITE_TWELVEURL_FORMER +
        "" +
        ticker +
        import.meta.env.VITE_TWELVEURL_LATTER;
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log("data:", data);

                console.log(
                    "🚀 ~ file: Graph.jsx:33 ~ fetchData ~ ticker:",
                    ticker
                );
                const result = data[ticker].values;

                // Use Promise.all to wait for all map operations to complete
                const finalThing = await Promise.all(
                    result.map(async (point) => ({
                        datetime: point.datetime.split(" ")[1],
                        close: parseFloat(point.close),
                    }))
                );

                const closeValues = finalThing.map((data) => data.close);
                setExtremes({
                    min: Math.min(closeValues),
                    max: Math.max(closeValues),
                });

                setGraphInfo(finalThing.reverse());
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, [ticker, url]);

    return (
        <div className="flex flex-col justify-center my-3.5 mx-3.5 w-full h-full">
            <h1 className="text-3xl text-red-700 text-center">{ticker}</h1>
            <ResponsiveContainer width="70%" height="70%">
                <LineChart
                    width={500}
                    height={300}
                    data={graphInfo}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="datetime" />
                    <YAxis
                        type="number"
                        domain={[extremes.min, extremes.max]}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="close"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

Graph.propTypes = {
    ticker: PropTypes.string,
};
