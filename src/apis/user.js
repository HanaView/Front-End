import onRequest from "@/utils/axios";

export const getTest = async () =>
  await onRequest({
    method: "GET",
    url: `/repos/TanStack/query`
  })