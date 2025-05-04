let interactData = null; // In-memory storage for the payload

export default function handler(req, res) {
  if (req.method === "POST") {
    const { payload } = req.body;

    if (!payload) {
      return res.status(400).json({ error: "No payload provided" });
    }

    // Update the in-memory data
    interactData = payload;

    console.log("Payload received and stored:", interactData);
    return res.status(200).json({ message: "Payload updated successfully" });
  } else if (req.method === "GET") {
    // Return the current interact data
    return res.status(200).json({ data: interactData });
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}