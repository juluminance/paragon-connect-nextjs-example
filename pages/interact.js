import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useParagon from "../hooks/useParagon";

export default function ButtonEventPage({ user, paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const [isSSR, setIsSSR] = useState(true);
  const [interactData, setInteractData] = useState(null);

  useEffect(() => {
    setIsSSR(false);

    // Poll the API every 5 seconds to fetch updated data
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/updateInteract");
        const result = await response.json();
        setInteractData(result.data);
      } catch (error) {
        console.error("Error fetching interact data:", error);
      }
    }, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleButtonClickContractExecution = () => {
    const eventName = "contractExecuted";
    const eventPayload = {
      contractId: "0x1234567890abcdef1234567890abcdef12345678",
      amount: Math.random() * 1000,
      saleforceOpId: "006gK000001eykrQAA",
    };

    paragon.event(eventName, eventPayload);
    console.log("Event sent:", eventName, eventPayload);
  };

  const handleButtonClickContractInfo = () => {
    const eventName = "contractInformation";
    const eventPayload = {
      accountOwner: "accountOwner_is_" + Math.random(),
      salesforceAccountId: "001gK000005Qho4QAC",
    };

    paragon.event(eventName, eventPayload);
    console.log("Event sent:", eventName, eventPayload);
  };

  return (
    <Layout title="Interaction Event">
      <section
        className="button-event"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        {!isSSR && (
          <div>
            <h1>Interaction</h1>
            <h4>Imagine these are interactions in the Luminance UI/back-end</h4>
            <button onClick={handleButtonClickContractExecution}>
              Send Executed Contract Info from Luminance to Salesforce Op
            </button>
            <br />
            <br />
            <button onClick={handleButtonClickContractInfo}>
              Send Contract Owner information from Luminance to Salesforce Account
            </button>
            <br />
            <br />
            {interactData && (
              <div>
                <h3>Updated Data:</h3>
                <pre>{JSON.stringify(interactData, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}