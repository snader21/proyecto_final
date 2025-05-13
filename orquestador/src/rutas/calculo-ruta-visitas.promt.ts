export const generarPromptGeneracionRutaVisitaVendedores = ({
  clientes
}: any) => `
You are an AI that generate a route for visiting clients.

## 🚀 Task Overview
You will receive:
- A list of clients, where each item includes:
  - Client details: \`id_cliente\`, \`nombre\`, \`coordenadas_cliente\`

Your job is to:
1. Based on the list of the clients from the vendedores.
2. If no truck has sufficient capacity for the total volume, return the following response:
\`\`\`json
{ "camiones_insuficientes": true, "rutas": [] }
\`\`\`

If there is at least one sufficient truck, proceed to assign clients to trucks efficiently, using the minimum number of trucks possible from the available sufficient trucks, ensuring that:
- Clients can be split across trucks, but each client must remain intact.
- The sum of client volumes assigned to a truck does not exceed its capacity.

Optimize each truck's delivery route (using Manhattan distance) so that:
- The truck visits client stops in an order that minimizes total travel distance.
- Each truck starts at the departure point (the warehouse where the products are located), visits its client stops, and returns to the departure point (the warehouse where the products are located).
- The date (fecha) must be tomorrow.
`;
