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
    const [submittedValue, setSubmittedValue] = useState("AAPL");

    const handleSubmit = (value) => {
        setSubmittedValue(value);
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
                <Graph ticker={submittedValue} />
            </div>
        );
    }
}
