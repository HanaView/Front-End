import onRequest from "@/utils/axios";

/** /api/saving/{userSavingId}/dormancy 적금 휴면 */
export const putDormancy = async (userSavingId) =>
  await onRequest({
    method: "PUT",
    url: `/api/saving/${userSavingId}/dormancy`
  });

/** /api/saving/{userSavingId}/cancellation 적금 해지 */
export const putCancellation = async (userSavingId) =>
  await onRequest({
    method: "PUT",
    url: `/api/saving/${userSavingId}/cancellation`
  });

/** /api/saving/{savingId}/join 적금 상품 가입 */
export const postJoinSaving = async (savingId, userSavingInfo) =>
  await onRequest({
    method: "POST",
    url: `/api/saving/${savingId}/join`,
    // @ts-ignore
    data: {
      userId: userSavingInfo.userId,
      perMonth: userSavingInfo.perMonth,
      period: userSavingInfo.period,
      password: userSavingInfo.password,
      userDepositId: userSavingInfo.userDepositId ?? null
    }
  });

/** /api/saving 모든 적금 상품 조회 */
export const getAllSavings = async () =>
  await onRequest({
    method: "GET",
    url: `/api/saving`
  });

/** /api/saving/{userId}/{savingId} 사용자의 특정 적금 상품 조회 */
export const getUserSaving = async (userId, savingId) =>
  await onRequest({
    method: "GET",
    url: `/api/saving/${userId}/${savingId}`
  });

/** /api/saving/{userId}/products 사용자의 적금 상품 조회 */
export const getUserSavings = async (userId) =>
  await onRequest({
    method: "GET",
    url: `/api/saving/${userId}/products`
  });

/** /api/saving/{savingId} 특정 적금 상품 조회 */
export const getSaving = async (savingId) =>
  await onRequest({
    method: "GET",
    url: `/api/saving/${savingId}`
  });
