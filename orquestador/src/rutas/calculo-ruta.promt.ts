export const generarPromptOptimizacionRutas = ({
  departure,
  orders,
  truckCapacity,
}) => `
You are an AI that optimizes delivery routes and truck allocations based on Manhattan distance between coordinates.

## **🚀 Task**
I will provide you with:
- A **starting point** (departure longitude and latitude).
- A **list of orders**, where each order has:
  - Order ID (\`id\`)
  - Longitude (\`lng\`) and Latitude (\`lat\`).
  - A list of products, where each product has:
    - Product ID (\`id\`)
    - Volume (in liters)
- The **truck capacity** in liters.

---

## **🚨 Important Constraints (DO NOT VIOLATE)**
1️⃣ **Each product must be delivered whole. You CANNOT split a single product into multiple trucks.**  
2️⃣ Orders **can** be split across multiple trucks, but **individual products must remain intact**.  
3️⃣ A truck's **total assigned volume cannot exceed the truck's capacity**.  
4️⃣ Each truck must **return to the departure location** after completing deliveries.  

---

### **❌ Invalid Example (🚫 Product is split between two trucks - NOT ALLOWED)**
\`\`\`json
{
  "trucks": [
    {
      "id": 1,
      "products": [{ "product_id": "PROD003", "order_id": "ORD003", "volume": 500 }]
    },
    {
      "id": 2,
      "products": [{ "product_id": "PROD003", "order_id": "ORD003", "volume": 700 }]
    }
  ]
}
\`\`\`
🚫 This is incorrect because **PROD003 is split into two trucks**.

---

### **✅ Valid Example 1 (✔ An order is split between two trucks, but products remain whole)**
\`\`\`json
{
  "trucks": [
    {
      "id": 1,
      "products": [
        { "product_id": "PROD001", "order_id": "ORD001", "volume": 500 }
      ]
    },
    {
      "id": 2,
      "products": [
        { "product_id": "PROD002", "order_id": "ORD001", "volume": 700 }
      ]
    }
  ]
}
\`\`\`
✔ **CORRECT!** The order "ORD001" is split between trucks **without splitting products**.

---

### **✅ Valid Example 2 (✔ Multiple orders assigned to different trucks)**
\`\`\`json
{
  "trucks": [
    {
      "id": 1,
      "products": [
        { "product_id": "PROD001", "order_id": "ORD001", "volume": 500 },
        { "product_id": "PROD002", "order_id": "ORD002", "volume": 500 }
      ]
    },
    {
      "id": 2,
      "products": [
        { "product_id": "PROD003", "order_id": "ORD003", "volume": 1200 }
      ]
    }
  ]
}
\`\`\`
✔ **CORRECT!** Products from different orders are assigned to different trucks while remaining whole.

---

## **📌 Your Responsibilities**
1️⃣ **Determine the minimum number of trucks needed**, maximizing efficiency (use the fewest trucks possible).  
2️⃣ **Assign orders and their products to trucks efficiently** while ensuring trucks do not exceed capacity.  
   - **Keep products intact** (never split individual products across trucks).  
   - **You can assign products from the same order to different trucks if needed**.  
   - **Always track which original order each product belongs to**.  
3️⃣ **Optimize the delivery route for each truck**, using Manhattan distance, **prioritizing the closest stops first**.  
4️⃣ **Ensure trucks return to the starting point** after deliveries are complete.  
5️⃣ **Return the response in the specified JSON format**.

---

### **🚀 Input Data:**
\`\`\`json
{
  "departure": ${JSON.stringify(departure, null, 2)},
  "orders": ${JSON.stringify(orders, null, 2)},
  "truck_capacity": ${truckCapacity}
}
\`\`\`

---

## **🚀 Expected Output Format**
The response should be a JSON object with the following structure:
\`\`\`json
{
  "trucks": [
    {
      "id": 1,
      "total_volume": 1000,
      "products": [
        {
          "product_id": "PROD001",
          "order_id": "ORD001",
          "volume": 500
        },
        {
          "product_id": "PROD002",
          "order_id": "ORD002",
          "volume": 500
        }
      ],
      "route": [
        {"lng": -99.1332, "lat": 19.4326, "type": "departure"},
        {"lng": -99.1500, "lat": 19.4600, "type": "delivery", "order_id": "ORD002", "products": ["PROD002"]},
        {"lng": -99.2000, "lat": 19.4500, "type": "delivery", "order_id": "ORD001", "products": ["PROD001"]},
        {"lng": -99.1332, "lat": 19.4326, "type": "return"}
      ]
    }
  ],
  "total_trucks_used": 1,
  "total_volume": 1000
}
\`\`\`

🚨 **IMPORTANT:**
- **DO NOT split a single product into multiple trucks**.
- **Ensure all output follows the constraints**.

---
`;
