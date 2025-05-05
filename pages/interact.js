import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import useParagon from "../hooks/useParagon";

export default function ButtonEventPage({ user, paragonUserToken }) {
  const { paragon } = useParagon(paragonUserToken);
  const [isSSR, setIsSSR] = useState(true);
  const [interactData, setInteractData] = useState(null);
  const [overlay, setOverlay] = useState({ visible: false, content: "" });

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

  const handleButtonClick = async (eventName, eventPayload) => {
    try {
      paragon.event(eventName, eventPayload);
      setOverlay({
        visible: true,
        content: `Event sent: ${eventName}\nPayload: ${JSON.stringify(eventPayload, null, 2)}`,
      });
    } catch (error) {
      setOverlay({
        visible: true,
        content: `Error: ${error.message}`,
      });
    }
  };

  const closeOverlay = () => {
    setOverlay({ visible: false, content: "" });
  };

  return (
    <Layout title="Interaction">
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
            <button
              onClick={() =>
                handleButtonClick("contractExecuted", {
                  contractId: "0x1234567890abcdef1234567890abcdef12345678",
                  amount: Math.random() * 1000,
                  saleforceOpId: "006gK000001eykrQAA",
                })
              }
            >
              Send Executed Contract Info from Luminance to Salesforce Op
            </button>
            <br />
            <br />
            <button
              onClick={() =>
                handleButtonClick("contractInformation", {
                  accountOwner: "accountOwner_is_" + Math.random(),
                  salesforceAccountId: "001gK000005Qho4QAC",
                })
              }
            >
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
        {overlay.visible && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              zIndex: 1000,
            }}
          >
            <pre style={{ whiteSpace: "pre-wrap", textAlign: "center" }}>
              {overlay.content}
            </pre>
            <button
              onClick={closeOverlay}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "white",
                color: "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
}