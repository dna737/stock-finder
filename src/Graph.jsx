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

export default function Graph() {
    const url = import.meta.env.VITE_TWELVEURL;
    const [graphInfo, setGraphInfo] = useState([]);
    const [extremes, setExtremes] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log("data:", data);

                const result = data["AAPL"].values;

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
                setGraphInfo(finalThing);
                console.log("finalThing:", finalThing);
                console.log("result:", result);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    // ... rest of your component
    return (
        <ResponsiveContainer width="100%" height="100%">
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
                <YAxis type="number" domain={[extremes.min, extremes.max]} />
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
    );
}
