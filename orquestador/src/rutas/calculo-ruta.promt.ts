import { IDatosRuta } from './rutas.service';

export const generarPromptOptimizacionRutas = ({
  departure,
  orders,
  truckCapacity,
}: IDatosRuta) => `
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

Your job is to:
1. Determine the minimum number of trucks needed (using as few trucks as possible).
2. Assign orders and their products to trucks efficiently, ensuring that:
   - **No individual product is split** between trucks.
   - Orders can be split across trucks, but each product must remain intact.
   - The sum of product volumes assigned to a truck does not exceed its capacity.
3. Optimize each truck's delivery route (using Manhattan distance) so that:
   - The truck visits delivery stops in an order that minimizes total travel distance.
   - Each truck starts at the departure point, visits its delivery stops, and returns to the departure point.
4. **Return the result in the following JSON format:**

\`\`\`json
{
  "fecha": "2025-03-28T10:00:00Z", 
  "duracionEstimada": 120, 
  "distanciaTotal": 50, 
  "tipoRutaId": 1,
  "camionId": 1,
  "nodos": [
    {
      "numeroNodoProgramado": 1,
      "latitud": 19.4326,
      "longitud": -99.1332,
      "productos": [
        {
          "productoId": 101,
          "pedidoId": "ORD001"
        },
        {
          "productoId": 102,
          "pedidoId": "ORD002"
        }
      ]
    },
    {
      "numeroNodoProgramado": 2,
      "latitud": 19.4500,
      "longitud": -99.2000,
      "productos": [
        {
          "productoId": 103,
          "pedidoId": "ORD003"
        }
      ]
    }
  ]
}
\`\`\`

---

## **🚨 Important Constraints (DO NOT VIOLATE)**
- **Each product must be delivered whole. You CANNOT split a single product into multiple trucks.**
- Orders can be split among trucks, but **each product must remain intact**.
- A truck's total assigned volume must not exceed its capacity.
- Each truck's route must begin and end at the departure coordinates, which should be:
- The FIRST node in the "nodos" array (with numeroNodoProgramado: 1)
- The LAST node in the "nodos" array (with numeroNodoProgramado: N)
- Both departure nodes must include the original departure coordinates even if they contain no products
- **Ensure that the output strictly follows the JSON structure above.**

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

## **Your Responsibilities**
- **Calculate the optimized routes** for the minimum number of trucks needed.
- **Assign products from orders to trucks** without splitting any product.
- Optimize the route for each truck using Manhattan distance, considering:
- 1. Start at departure point (first node)
- 2. Visit delivery stops in optimal order
- 3. Return to departure point (last node)
- Calculate total distance including both departure and return legs
- **Return the response exactly in the JSON format specified above**.

---

Remember: Do not include any extra fields or text outside the JSON structure. Your output should be a valid JSON object that matches the format of the DTOs:

- **CreateRutaDto:**
  - fecha: string
  - duracionEstimada: number
  - distanciaTotal: number
  - tipoRutaId: number
  - camionId: number
  - nodos: CreateNodoRutaDto[]

- **CreateNodoRutaDto:**
  - numeroNodoProgramado: number
  - latitud: number
  - longitud: number
  - productos: CreateNodoProductoDto[]

- **CreateNodoProductoDto:**
  - productoId: number
  - pedidoId: string

---

Use the input data to produce the optimal routing and output your result in the JSON format provided.
`;
