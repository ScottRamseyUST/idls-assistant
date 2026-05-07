const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const SOP = `
IDLS BASIC NAVIGATION
Command/Quick Search: top right of screen. Quick Order Search: top left.
Main Tabs: Home (Files, Viewing Options, Tools, Analytics), Finance (Invoicing, Loads, Settlements), Orders (Order Options/Tools), Delivery (Delivery Options/Tools), Inventory (Receiving, Transfers, Barcodes, Picking), Distribution (Shipments), Action Center, Contractors (Options, History, Settlement, Extras), Issue Log, Options (Appearance, Settings, Server Connection), Help.
Grid tips: TAB to add a row. Ctrl+Del to delete a row.

IDLS USER MANAGEMENT
Open: Options tab > Users > User Security Editor.
ADD USER: Click Add. Fill: First/Last Name, User ID, Password, User Type. Check Active. Check force password change on next login.
EDIT USER: Options > Users > Edit. Update info. Save.
COPY USER: Options > Users > select user > Copy User. Fill in new name/email. Force password change.
Default: new users assigned to All Users Group.

IDLS HUBS
Shows all active and inactive hubs.
ADD HUB: Click Add (bottom left). Required: Name, Address, Abbrev (up to 10 chars), Time Zone, Start Time, Time Windows (2/3/4-hour), Minutes Per Stop (minimum in-home time), Phone/Email (for consumer notifications).

IDLS CLIENTS
Shows all active/inactive clients. Double-click to open Client List and view/edit. Multiple tabs in client details.

IDLS TRUCK EDITOR
Found under Contractors tab.
ADD TRUCK: Contractors > Truck Editor > Add (bottom left). Details tab: fill truck info. Stop Rates tab: fuel surcharge and truck rates. Check Active (top right). Save.
EDIT TRUCK: double-click or select + Edit. Make changes. Save (bottom right).

IDLS DRIVER EDITOR
Found under Contractors tab.
ADD DRIVER: Contractors > Driver Editor > Add Driver. Fill 5 sections:
1. Driver tab: First Name, Last Name, Address, Mobile Phone, License info.
2. Background Check tab: Provider Name, Reference #, Effective Date, Expiration Date.
3. Mobile Dispatch tab: Set Login and Password (REQUIRED for mobile app access).
4. Assigned Hubs tab: Add/Remove hubs.
5. Photo tab: Load Image (bottom right).
Save (bottom right). Closing without saving triggers confirmation.
EDIT DRIVER: Contractors > Driver Editor > Edit Driver. Make changes. Save.

IDLS ORDERS
SEARCH: Orders tab > Search. Search by Sales Order, Last Name, Phone Number. Set Max orders to return. Options for advanced filters. Saved filters on right. Right-click for Check All/Clear All/Restore Defaults.
ADD ORDER: Orders tab > Add > Sales Order Data Entry. Enter Customer Info, Client Info, Order Status, Merchandise Info, Delivery Info, Notes, Task. At least one phone number required. Returning customers auto-fill from phone. Address: click ! icon > Address Validation > verify > OK. Enter SKU, Client, Style, Description. Save.

IDLS WMS (WAREHOUSE MANAGEMENT SYSTEM)
WiFi required throughout warehouse. Cellular also works. Recommended: Zebra ZP450 thermal printer.
WMS LOGIN: Go to https://werner.idls.cloud/ > Username and Password > Login. Multiple hubs: select hub > Select hub and login.
RECEIVING: Camera icon to scan barcode (or type manually). Click Create Load to upload.
ORDER LOOKUP: Utilities > Order Lookup > View/Search Orders.

IDLS SUPPORT
Email: support@dashlogistics.com (most common).
Portal: Email support@dashlogistics.com for portal access. Portal has Help, Index, Search.

IDLS ROUTING MANAGER
Organizes and optimizes routes by hub and date. Views: list, region/zip, by Door, HERE Maps.
OPEN: Delivery tab > Routing Manager.
STEPS: 1) Select Delivery Date. 2) Select Hub. 3) Optional: Options to filter. 4) Click Compile.
Unassigned Stops = by region (UNK until assigned). Assigned Stops = sorted into Doors.
ASSIGN STOPS: Rectangle or Polygon to select stops. Choose Door to assign.
OPTIMIZE: Select route > Optimize. Drag/drop stops for time requests.

IDLS DISPATCH & CHECK IN
DISPATCH: Delivery tab > Dispatch > enter Delivery Date, Hub, Client.
View order: select > View Order. Edit/pullbacks: double-click > Check In Details.
Assign Truck/Driver via dropdown (REQUIRED for driver mobile app login).
ADD ACCESSORIAL IN DISPATCH: Check In Details > Accessorials tab > down arrow for new line > Type, Qty, Invoice, Payment > OK.
CHECK IN: Delivery tab > Check-In > enter date range, Hub, Client, Return Type.
Change door: Change Door. Change stop: Change Stop. Add charge: Add Accessorial Charge.
Set status: Overall Check-In Status dropdown: Canceled / Completed / Non-Delivery.
Non-Delivery: select reason from dropdown.

IDLS ACCESSORIALS
Add/View Sales Order Accessorial: add or view charges on a specific order.
Add/View Truck Accessorial: add or view charges on a truck.
Add/View Delivery Accessorial: add or view charges for a delivery date.
All additions require selecting type and entering authorization code.

IDLS REPORTS
Location: Home > Settings > Reports.

IDLS CLIENT PORTAL
SEARCH INVENTORY: Inventory > Search. Fields: SKU, Order Number, PO Number, Received Date, Status.
INVENTORY AVAILABILITY: Inventory > Inventory Availability. Fields: SKU, PO Number, Received Date, Hub, Client.
SKU EDITOR: Inventory > SKU Editor. Add New Sku button top right.
VIEW ORDER: View Order at top. Search by Order Number, Last Name, Phone, Entry Date, Delivery Date.
VIEW DELIVERIES: View Deliveries at top. Enter Hub and Delivery Date.

IDLS HUB FINDER
Hub Finder at top > enter zip code > Search. Not serviced: error message. Serviced: Hub address, miles, receiving hours.

IDLS TODAY'S ROUTES
Today's Routes at top. Map view in separate tab. Switch hubs: dropdown top left.

IDLS CUSTOMER SELF-SCHEDULING PORTAL
Lets customers self-schedule delivery.
CUSTOMER FLOW: 1) See name/address/contract info. 2) Click Schedule. 3) Verify address. 4) Add notes > Next. 5) Answer questions > Next Step. 6) Select date (held 10 min). 7) Finalize Confirmation.
SETUP: Client Settings > Hubs tab > check Customer Self Schedule. Upload logo. Configure questions. Set up email/SMS notifications.

IDLS ALLOCATIONS
View: Delivery Settings > Allocations.
Allocated = orders/pieces available to schedule. Scheduled = already scheduled.
When Scheduled >= Allocated: no more orders for that region without special privileges.
`;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        system: `You are the IDLS Help Assistant for the Williams Sonoma Tulsa delivery operation. Answer questions about IDLS based solely on the SOP documentation below. Use numbered steps for how-to questions. Use exact button/tab/window names. Be concise but complete. Add a TIP: line at the end when there's a helpful shortcut or common mistake. If not covered in SOPs, say so and direct to support@dashlogistics.com.\n\nSOP DOCUMENTATION:\n${SOP}`,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.json({ reply: data.content?.[0]?.text || "No response." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`IDLS Assistant running on port ${PORT}`));
