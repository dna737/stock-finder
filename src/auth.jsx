import { BuyMeACoffee } from "./Coffee";
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
    const [currInput, setCurrInput] = useState(["AAPL", true]);

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
                {(currInput[1] && <Graph ticker={currInput[0]} />) ||
                    (<ErrorComponent /> && activateCoffeeButton())}
            </div>
        );
    }
}

function activateCoffeeButton() {
    document.getElementById("buyMeACoffee").showModal();
}

function ErrorComponent() {
    return (
        <div className="flex flex-col justify-center my-3.5 mx-3.5 w-full h-full">
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
                className="btn hidden"
                onClick={() =>
                    document.getElementById("buyMeACoffee").showModal()
                }
            ></button>
            <dialog id="my_modal_4" className="modal">
                <div className="modal-box w-11/12 max-w-5xl">
                    <h3 className="font-bold text-lg">
                        API credits used up for the minute!
                    </h3>
                    <p className="py-4">
                        The Graph could not be generated due to the free-tier
                        API plan this project is currently using. If you wish to
                        get rid of rate-limits, considering buying me a coffee.
                        ;&rpar;
                    </p>
                    <div className="modal-action">
                        <form method="dialog" className="flex-col">
                            {/* if there is a button, it will close the modal */}
                            <BuyMeACoffee />
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
