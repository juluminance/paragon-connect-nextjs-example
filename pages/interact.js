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

  const handleButtonClickAppEvent = async (eventName, eventPayload) => {
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

    const handleButtonClickRequest = async (workflowId, eventPayload) => {
    try {
      await paragon.workflow(workflowId, eventPayload);
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

  var paragonJson = {
     workflow_actions: {
             send_file_for_signature: {
                     action_name: "send_file_for_signature",
                     docusign: "workflow_id",
                     signatureOwner: "signature_owner"
             },
             send_file_to_integration: {
                    action_name: "send_file_to_integration",
                    salesForceworkflowId: "df733a9e-98e9-4b27-8a94-1946e84c2afc",
                    salesforce: "workflow_id",
                    opportunityId: "opportunity_id",
                    sharepointWorkflowId: "workflow_id",
                    file: "file_id",
                    fileName: "file_name",
                    fileType: "file_type",
                    fileSize: "file_size",
                    fileUrl: "file_url",
                    fileDescription: "file_description",
             },
             send_data_to_integration: {
                    action_name: "send_data_to_integration",
                    salesforce: "workflow_id",
                    opportunityId: "006gK000001eykrQAA",
                    sharepoint: "workflow_id",
                    file: "file_id",
                    fileName: "file_name",
                    fileType: "file_type",
                    fileSize: "file_size",
                    fileUrl: "file_url",
                    fileDescription: "file_description",
                    amount: "amount",
                    contractId: "contract_id",
                    contractName: "contract_name",
                    contractOwner: "contract_owner",
                    contractStatus: "contract_status",
                    contractType: "contract_type",
                    contractStartDate: "contract_start_date",
                    contractEndDate: "contract_end_date",
                    contractEffectiveDate: "contract_effective_date",
                    contractExpirationDate: "contract_expiration_date",
                    contractRenewalDate: "contract_renewal_date",
                    contractTerminationDate: "contract_termination_date",
                    contractPaymentTerms: "contract_payment_terms",
                    contractBillingCycle: "contract_billing_cycle",
                    contractCurrency: "contract_currency",
                    contractBillingAddress: "contract_billing_address",
                    contractShippingAddress: "contract_shipping_address",
                    contractBillingContact: "contract_billing_contact",
                    contractShippingContact: "contract_shipping_contact",   
             },
             pull_data_from_integration: {
                    action_name: "pull_data_from_integration",
                    sharepoint: "workflow_id",
                    salesforce: "workflow_id",
                    opportunityId: "opportunity_id",
                    file: "file_id",
                    fileName: "file_name",
                    fileType: "file_type",
                    fileSize: "file_size",
                    fileUrl: "file_url",
                    fileDescription: "file_description",
            }
      }
}

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
              onClick={() =>handleButtonClickAppEvent(
                paragonJson.workflow_actions.send_data_to_integration.action_name, 
                paragonJson.workflow_actions.send_data_to_integration)
              }
            >
              Send Executed Contract Info from Luminance to Salesforce Op (App Event)
            </button>
            <br />
            <br />
            <button
              onClick={() =>
                handleButtonClickRequest(
                  paragonJson.workflow_actions.send_file_to_integration.salesForceworkflowId, 
                  paragonJson.workflow_actions.send_file_to_integration)
              }
            >
              Send Contract Owner information from Luminance to Salesforce Account (Request)
            </button>
            <br />
            <br />
            {interactData && (
              <div>
                <h3>Updated Data:</h3>
                <pre>{JSON.stringify(interactData, null, 2)}</pre>
              </div>
            )}``
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