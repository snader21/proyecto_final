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
1. CRITICAL: Use NOW (${new Date().toISOString()}) as the reference point for all date calculations.
2. For each client, calculate next_visit_date following these STRICT rules:
   \`\`\`
   NOW = ${new Date().toISOString()}
   TOMORROW = NOW + 1 day
   ONE_WEEK_FROM_NOW = NOW + 7 days

   if (ultima_visita is null OR ultima_visita < NOW - 7 days)
     next_visit_date = TOMORROW
   else if (ultima_visita < NOW)
     next_visit_date = ONE_WEEK_FROM_NOW
   else
     next_visit_date = ultima_visita  // Keep future dates as is
   \`\`\`

3. VALIDATION: Before returning any date, ensure:
   - date > NOW
   - 8:00 AM ≤ time ≤ 5:00 PM
   If any validation fails, adjust to next valid time slot.

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

## 📦 Output Format Example (MUST follow this structure)

IMPORTANT: This is just an example. Replace all dates with proper future dates based on NOW (${new Date().toISOString()}).

\`\`\`json
{
  "vendedores": [
    {
      "id_vendedor": "9db58905-196b-4176-bf25-964716a9e95a",
      "visitas_programadas": [
        {
          "duracionEstimada": 30,
          "fecha": "2025-05-18",
          "distanciaTotal": 50,
          "camionId": null,
          "nodos": [
            {
              "numeroNodoProgramado": 1,
              "latitud": 4.6014581,
              "longitud": -74.2185687,
              "direccion": null,
              "hora_llegada": "2025-05-18T08:00:00.000Z",
              "hora_salida": "2025-05-18T08:30:00.000Z",
              "id_bodega": null,
              "id_cliente": "123e4567-e89b-12d3-a456-426614174001",
              "id_pedido": null,
              "productos": null
            }
          ]
        }
      ]
    }
  ]
}
\`\`\`

NOTES:
1. All dates MUST be after ${new Date().toISOString()}
2. Visit times MUST be between 8:00 AM and 5:00 PM
3. Each visit lasts exactly 30 minutes
4. Format dates as YYYY-MM-DD for fecha and full ISO string for times

Each route starts nearest to the client.
All coordinates must be numbers (convert strings if needed).

## 🚨 CRITICAL RULES - ANY VIOLATION WILL BE REJECTED

1. **Date Validation (STRICT)**
   \`\`\`
   NOW = ${new Date().toISOString()}
   
   For every date in response:
   - MUST be > NOW
   - MUST be between 8:00 AM and 5:00 PM
   - MUST be in ISO format
   \`\`\`

2. **Visit Scheduling (STRICT)**
   \`\`\`
   For each client:
   if (ultima_visita == null || ultima_visita < NOW - 7 days)
     schedule_for = TOMORROW at 8:00 AM + offset
   else if (ultima_visita < NOW)
     schedule_for = NOW + 7 days at 8:00 AM + offset
   else
     schedule_for = ultima_visita  // Keep future dates
   \`\`\`

3. **Route Rules**
   - Group by vendor_id
   - Max 4 clients/day/vendor
   - Use Manhattan distance
   - Start from (0,0)
   - 30 min per visit

4. **Response Format**
   - Match example JSON exactly
   - All dates > NOW
   - All coordinates as numbers
`;
