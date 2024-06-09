import { http, HttpResponse } from "msw";
import depositHandler from "./handler/deposit";

// Describe the network.
export const handlers = [
  ...depositHandler,
  http.get("https://acme.com/product/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "Porcelain Mug",
      price: 9.99
    });
  })
];
