import { http, HttpResponse } from "msw";

const depositHandler = [
  http.get("https://acme.com/product/:id", ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      title: "Porcelain Mug",
      price: 9.99
    });
  })
];
export default depositHandler;
