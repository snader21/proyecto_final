export const generarPromptOptimizacionRutas = ({
  productosPorDespachar,
  camiones,
}: any) => `
You are an AI that optimizes delivery routes and truck allocations based on Manhattan distance between coordinates.

## 🚀 Task Overview
You will receive:
- A list of products to dispatch, where each item includes:
  - Product details: \`id_producto\`, \`volumen_total (in liters)\`, \`cantidad\`, \`id_pedido\`
  - Client details: \`id_cliente\`, \`nombre\`, \`coordenadas_cliente\`
  - Bodega (warehouse) details: \`id_bodega\`, \`coordenadas_bodega\`
- A list of available trucks, each with:
  - \`id\` (UUID), \`capacidad\` (volume in liters), and driver information

Your job is to:
1. Calculate the total volume of all products to be dispatched.
2. Determine if there is at least one truck available with a capacity greater than or equal to the total volume calculated in step 1.
3. If no truck has sufficient capacity for the total volume, return the following response:
\`\`\`json
{ "camiones_insuficientes": true, "rutas": [] }
\`\`\`

If there is at least one sufficient truck, proceed to assign orders and their products to trucks efficiently, using the minimum number of trucks possible from the available sufficient trucks, ensuring that:
- No individual product is split between trucks. It's worth to mention that the total quantity of products can be split into multiple trucks. Also, a product of an order can be dispatched from different warehouses in different routes, if it has a different starting point (the warehouse where the product is located).
- Orders can be split across trucks, but each product must remain intact.
- The sum of product volumes assigned to a truck does not exceed its capacity.

Optimize each truck's delivery route (using Manhattan distance) so that:
- The truck visits delivery stops in an order that minimizes total travel distance.
- Each truck starts at the departure point (the warehouse where the products are located), visits its delivery stops, and returns to the departure point (the warehouse where the products are located).
- The date (fecha) must be tomorrow.

## 📦 Output Format
For each truck used, return a JSON object in the following format:

\`\`\`json
{
  "camiones_insuficientes": false,
  "rutas": [
    {
      "duracionEstimada": 120,
      "fecha": ${(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
      })()},
      "distanciaTotal": 50,
      "camionId": "245459bf-9c13-40a4-b157-a7e6d3dbb43a",
      "nodos": [
        {
          "numeroNodoProgramado": 1,
          "latitud": 4.6014581,
          "longitud": -74.2185687,
          "direccion": "Calle 123",
          "hora_llegada": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(8, 0, 0, 0);
            return d.toISOString();
          })()},
          "hora_salida": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(8, 30, 0, 0);
            return d.toISOString();
          })()},
          "id_bodega": "123e4567-e89b-12d3-a456-426614174000",
          "id_cliente": null,
          "id_pedido": null,
          "productos": []
        },
        {
          "numeroNodoProgramado": 2,
          "latitud": 4.686609,
          "longitud": -74.027173,
          "direccion": "Calle 123",
          "hora_llegada": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(10, 0, 0, 0);
            return d.toISOString();
          })()},
          "hora_salida": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(10, 30, 0, 0);
            return d.toISOString();
          })()},
          "id_cliente": "123e4567-e89b-12d3-a456-426614174001",
          "id_pedido": "123e4567-e89b-12d3-a456-426614174002",
          "productos": [
            {
              "productoId": "550e8400-e29b-41d4-a716-446655440008",
              "cantidad": 1
            }
          ]
        },
        {
          "numeroNodoProgramado": 3,
          "latitud": 4.6014581,
          "longitud": -74.2185687,
          "direccion": "Calle 123",
          "hora_llegada": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(11, 0, 0, 0);
            return d.toISOString();
          })()},
          "hora_salida": ${(() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            d.setHours(11, 30, 0, 0);
            return d.toISOString();
          })()},
          "id_bodega": "123e4567-e89b-12d3-a456-426614174000",
          "id_cliente": null,
          "id_pedido": null,
          "productos": []
        }
      ]
    }
  ]
}
\`\`\`

Each route starts and ends at the bodega.
All coordinates must be numbers (convert strings if needed).
Only include the trucks that were assigned deliveries.

## 🚨 Rules Recap (DO NOT BREAK)
- Do NOT split a single product unit between trucks.
- Orders may be split, but products must remain whole.
- Do NOT exceed truck capacity.
- Do NOT include text outside the JSON.
- If no truck has sufficient capacity for the total volume: return \`{ "camiones_insuficientes": true, "rutas": [] }\`

## 📥 Input Data
\`\`\`json
{
  "productosPorDespachar": ${JSON.stringify(productosPorDespachar, null, 2)},
  "camiones": ${JSON.stringify(camiones, null, 2)}
}
\`\`\`

## Your Responsibilities
- Calculate the optimized routes for the minimum number of trucks needed from the sufficient trucks.
- Among the sufficient trucks, select the one with the smallest capacity to assign deliveries to. If the smallest truck is not enough, select the next one with the next smallest capacity.
- Assign products from orders to trucks without splitting any product.
- Optimize the route for each truck using Manhattan distance, considering:
  1. Start at departure point (the warehouse where the products are located)
  2. Visit delivery stops in optimal order
  3. Return to departure point (the warehouse where the products are located)
- Calculate total distance including both departure and return legs
- Return the response exactly in the JSON format specified above.

Use the input data to produce the optimal routing and output your result in the JSON format provided.
`;
