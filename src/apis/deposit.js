import onRequest from "@/utils/axios";

/** /api/deposit/{userDepositId}/dormancy 예금 휴면 */
export const putDormancy = async (userDepositId) =>
  await onRequest({
    method: "PUT",
    url: `/api/deposit/${userDepositId}/dormancy`
  });

/** /api/deposit/{userDepositId}/cancellation 예금 해지 */
export const putCancellation = async (userDepositId) =>
  await onRequest({
    method: "PUT",
    url: `/api/deposit/${userDepositId}/cancellation`
  });

/**  /api/deposit/{depositId}/join 예금 상품 가입  */
export const postJoin = async (depositId, userDepositInfo) =>
  await onRequest({
    method: "POST",
    url: `/api/deposit/${depositId}/join`,
    // @ts-ignore
    data: {
      userId: userDepositInfo.userId,
      balance: userDepositInfo.balance,
      period: userDepositInfo.period,
      password: userDepositInfo.password,
      userDepositId2: userDepositInfo.userDepositId2 ?? null
    }
  });

/**  /api/deposit 모든 예금 상품 조회 */
export const getAllDeposits = async () =>
  await onRequest({
    method: "GET",
    url: `/api/deposit`
  });

/**  /api/deposit/{userId}/{depositId} 사용자의 특정 예금 상품 조회 */
export const getUserDeposit = async (userId, depositId) =>
  await onRequest({
    method: "GET",
    url: `/api/deposit/${userId}/${depositId}`
  });

/**  /api/deposit/{userId}/products 사용자의 예금 상품 조회 */
export const getUserDeposits = async (userId) =>
  await onRequest({
    method: "GET",
    url: `/api/deposit/${userId}/products`
  });

/** /api/deposit/{depositId} 특정 예금 상품 조회 */
export const getDeposit = async (depositId) =>
  await onRequest({
    method: "GET",
    url: `/api/deposit/${depositId}`
  });
