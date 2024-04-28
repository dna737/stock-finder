import InputForm from "./InputForm";
import "./index.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Graph from "./Graph";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_CLIENT_URL,
    import.meta.env.VITE_SUPABASE_CLIENT_PW
);

export default function App() {
    const [session, setSession] = useState(null);
    const [currInput, setCurrInput] = useState(["AAPL", true]); //[ticker, tickerInDB];

    const handleSubmit = async (value) => {
        const { data, error } = await supabase
            .from("PermittedStocks")
            .select("Ticker")
            .match({ Ticker: value.toUpperCase() });

        console.log("data:", data);
        if (error) {
            console.error("Error checking the database:", error.message);
            return;
        }

        const isInDB = data.length > 0;

        setCurrInput([value.toUpperCase(), isInDB]);
        console.log("🚀 ~ file: auth.jsx:35 ~ handleSubmit ~  isInDB:", isInDB);

        console.log("newValueSet");
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (!session) {
        return (
            <div className="bg-white">
                <Auth
                    supabaseClient={supabase}
                    appearance={{ theme: ThemeSupa }}
                />
            </div>
        );
    } else {
        return (
            <div className="flex flex-col my-3.5 mx-3.5 justify-between w-full h-full">
                <InputForm onSubmit={handleSubmit} />
                {(currInput[1] && <Graph ticker={currInput[0]} />) || (
                    <ErrorComponent />
                )}
            </div>
        );
    }
}

function ErrorComponent() {
    return (
        <div className="flex text-center flex-col justify-center my-3.5 mx-3.5 w-full h-full">
            We weren&apos;t able to find a stock with that ticker. Please enter
            a valid ticker.
        </div>
    );
}
