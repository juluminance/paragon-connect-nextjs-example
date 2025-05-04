import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useParagon from "../hooks/useParagon";

export default function ButtonEventPage({ user, paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  const handleButtonClick = () => {
    // Trigger the Paragon event when the button is clicked

    var eventName = "contractExecuted";
    var eventPayload = {
      contractId: "0x1234567890abcdef1234567890abcdef12345678",
      amount: Math.random() * 1000,
      saleforceOpId: "006gK000001eykrQAA",
    };

    paragon.event(eventName, eventPayload)

    console.log("Event sent:", eventName, eventPayload);
  };

  return (
    <Layout title="Button Event">
      <section
        className="button-event"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        {!isSSR && (
          <div>
            <h1>Button Event Page</h1>
            <button onClick={handleButtonClick}>Send Exectuted Contract</button>
          </div>
        )}
      </section>
    </Layout>
  );
}