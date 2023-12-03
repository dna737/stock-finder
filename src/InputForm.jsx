import PropTypes from "prop-types";
import { useState } from "react";

export default function InputForm({ onSubmit }) {
    const [inputValue, setInputValue] = useState("AAPL");
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputValue);
        setInputValue("");
    };

    return (
        <div>
            <div className="text-2xl flex justify-center my-2.5">
                Enter a Stock Ticker below:
            </div>
            <form className="flex justify-center" onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        value={inputValue}
                        className="btn btn-outline btn-info"
                        onChange={handleChange}
                    />
                </label>
                <button
                    type="submit"
                    className="mx-3.5 btn btn-outline btn-info"
                >
                    GO
                </button>
            </form>
        </div>
    );
}

InputForm.propTypes = {
    onSubmit: PropTypes.func,
};
