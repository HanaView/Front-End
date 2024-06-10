import onRequest from "@/utils/axios";

// 카드 정지
export const putCancellation = async (userCardId) => {
  return await onRequest({
    method: "PUT",
    url: `/api/cards/${userCardId}/cancellation`
  });
};

// 카드 상품 가입
export const postJoinCard = async (cardId, userCardInfo) => {
  return await onRequest({
    method: "POST",
    url: `/api/cards/${cardId}/join`,
    data: userCardInfo
  });
};

// 카드 상품 등록
export const postRegisterCard = async (cardInfo) => {
  return await onRequest({
    method: "POST",
    url: `/api/cards/register`,
    data: cardInfo
  });
};

// 카드 카테고리 등록
export const postRegisterCardCategory = async (cardCategoryInfo) => {
  return await onRequest({
    method: "POST",
    url: `/api/cards/register/cardCategory`,
    data: cardCategoryInfo
  });
};

// 카드 혜택 등록
export const postRegisterBenefit = async (cardBenefitInfo) => {
  return await onRequest({
    method: "POST",
    url: `/api/cards/register/benefit`,
    data: cardBenefitInfo
  });
};

// 모든 카드 상품 조회
export const getAllCards = async () => {
  return await onRequest({
    method: "GET",
    url: `/api/cards`
  });
};

// 사용자 발급 카드 리스트 조회
export const getUserCards = async (userId) => {
  return await onRequest({
    method: "GET",
    url: `/api/cards/${userId}/products`
  });
};

// 카드 카테고리별 상품 조회
export const getCardsByCategory = async (cardCategoryId) => {
  return await onRequest({
    method: "GET",
    url: `/api/cards/${cardCategoryId}`
  });
};

// 사용자의 특정 카드 상품 보유 여부 조회
export const checkUserCardOwnership = async (userId, cardId) => {
  return await onRequest({
    method: "GET",
    url: `/api/cards/check/${userId}/${cardId}`
  });
};

// 카드 상품 카테고리 조회
export const getCardCategories = async () => {
  return await onRequest({
    method: "GET",
    url: `/api/cards/category`
  });
};
