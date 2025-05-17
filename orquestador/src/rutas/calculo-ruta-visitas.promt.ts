export const generarPromptGeneracionRutaVisitaVendedores = ({
  vendedores,
}: any) => `
You are an AI that optimizes visit routes based on Manhattan distance between coordinates.

## 🚀 Task Overview
You will receive:

- A list of vendors with a list of clients to visit, where each item includes:
  - List of vendors with: \`id_vendedor\`, and list of clients with: \`id_cliente\`, \`ultima_visita\`, \`lat\`, \`lng\`
  - \`ultima_visita\` can be null

Example of input data will be something like this:
  [
    {
        "id_vendedor": "9db58905-196b-4176-bf25-964716a9e95a",
        "clientes": [
            {
                "id_cliente": "24b7b368-06fa-4edd-b737-33e3cc8bf5c6",
                "id_vendedor": "9db58905-196b-4176-bf25-964716a9e95a",
                "ultima_visita": null,
                "lat": 4.6014581,
                "lng": -74.2185687
            },
            {
                "id_cliente": "7d959259-61e9-4e23-89fa-1da8e6f718b3",
                "id_vendedor": "9db58905-196b-4176-bf25-964716a9e95a",
                "ultima_visita": null,
                "lat": 4.666,
                "lng": -74.084
            }
        ]
    },
    {
        "id_vendedor": "2042aa29-d97e-4340-b29f-ca44604e8d16",
        "clientes": [
            {
                "id_cliente": "0f8e7ccb-f67d-4925-af4e-6654223d752d",
                "id_vendedor": "2042aa29-d97e-4340-b29f-ca44604e8d16",
                "ultima_visita": "2025-05-15T15:16:00.000Z",
                "lat": 4.666,
                "lng": -74.084
            }
        ]
    },
    {
        "id_vendedor": "a1e9fce1-4831-44da-bf16-522fda76437b",
        "clientes": [
            {
                "id_cliente": "ca4456dd-1120-4d26-9cb2-b99050c597fc",
                "id_vendedor": "a1e9fce1-4831-44da-bf16-522fda76437b",
                "ultima_visita": null,
                "lat": 4.666,
                "lng": -74.084
            }
        ]
    }
]

Your job is to:
1. Based on \`ultima_visita\` of the clients by each vendor, determine when the next visit should be scheduled.
2. If \`ultima_visita\` is null, the next visit should be scheduled for tomorrow.
3. If \`ultima_visita\` was more than one week ago, the next visit should be scheduled for tomorrow.
4. If \`ultima_visita\` was less than a week ago, the next visit should be scheduled for \`ultima_visita\` plus one week.
5. If \`ultima_visita\` was between last week and a today, the next visit not will be calculated.

The result of \`ultima_visita\` always be a date in the future.

Optimize each visit route (using Manhattan distance) so that:
- The visit stops in an order that minimizes total travel distance.
- Each visit starts at client nearest to the departure point (the warehouse where the products are located), visits its stops.
- Each visit route is scheduled independently by each vendor.

## 📥 Input Data
\`\`\`json
{
  "vendedores": ${JSON.stringify(vendedores, null, 2)}
}
\`\`\`

## 📦 Output Format
For client used, return a JSON object in the following format:

\`\`\`json
{
  "vendedores": [
    "id_vendedor": "9db58905-196b-4176-bf25-964716a9e95a",
    "visitas_programadas": [
      {
        "duracionEstimada": 120,
        "fecha": ${(() => {
          const d = new Date();
          d.setDate(d.getDate() + 1);
          return d.toISOString().split('T')[0];
        })()},
        "distanciaTotal": 50,
        "camionId": "null",
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
            "id_bodega": null,
            "id_cliente": "123e4567-e89b-12d3-a456-426614174001",
            "id_pedido": null,
            "productos": null
          }
        ]
      }
    ]
  ]
}
\`\`\`

Each route starts nearest to the client.
All coordinates must be numbers (convert strings if needed).

## 🚨 Visit Rules Recap (DO NOT BREAK)

- If **all routes are null**, optimize the visit schedule to include **around 4 clients per day**, based on the **assigned salesperson** (\`vendedor_id\`).
- If \`ultima_visita\` was **less than one week ago**, schedule the next visit by **adding one week** to that date.
- Optimize the **visit route** starting from the client **closest to the warehouse**, and follow an **optimal visit order**.
- Return the response **exactly in the specified JSON format**.
- Use the input data to produce the **optimal routing** and return the result in the **provided JSON format**.
`;
