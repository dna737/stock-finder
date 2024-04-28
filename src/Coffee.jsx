export function BuyMeACoffee() {
    return (
        <div className="flex flex-col justify-center my-3.5 mx-3.5 w-full h-full">
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
                className="btn hidden"
                id="modalTriggerButton"
                onClick={() =>
                    document.getElementById("buyMeACoffee").showModal()
                }
            ></button>
            <h3 className="text-center font-bold text-lg">
                API credits used up for the minute!
            </h3>
            <p className="py-4 text-center p-3">
                The Graph could not be generated due to the free-tier API plan
                this project is currently using. If you wish to get rid of
                rate-limits, consider clicking on the link below. ;&#41;
            </p>
            <div className="flex justify-center">
                <img
                    src="./src/assets/yellow-button.png"
                    onClick={() =>
                        window.open("https://www.buymeacoffee.com/dna737")
                    }
                    style={{ cursor: "pointer" }}
                ></img>
            </div>
        </div>
    );
}
