// API Base URL
const API_BASE_URL = 'http://localhost:8080/gateway';

// API 호출 헬퍼 함수 (Auth0 토큰 사용)
export const apiCall = async (endpoint: string, options: RequestInit = {}, accessToken?: string) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    // URL에서 중복된 슬래시 제거
    const url = `${API_BASE_URL}${endpoint}`.replace(/([^:]\/)\/+/g, "$1");
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};

// ==============================================
// 유저 서비스 API
// ==============================================

// 1. 사용자 개인 AI 키 등록
export const registerUserAIKey = async (secretName: string, secretValue: string, description: string, accessToken: string) => {
  return await apiCall('/users/api/secrets', {
    method: 'POST',
    body: JSON.stringify({
      secretName,
      secretValue,
      description
    })
  }, accessToken);
};

// 2. 사용자 개인 AI키 리스트 조회
export const getUserAIKeys = async (accessToken: string) => {
  return await apiCall('/users/api/secrets/arn', {
    method: 'GET'
  }, accessToken);
};

// 3. 사용자 개인 API키 삭제
export const deleteUserAIKey = async (keyId: string, accessToken: string) => {
  return await apiCall(`/users/api/secrets/${keyId}`, {
    method: 'DELETE'
  }, accessToken);
};

// ==============================================
// 외부 API 서비스
// ==============================================

// 0. 활성화된 외부API 목록 조회
export const getActiveExternalAPIs = async (accessToken: string) => {
  const response = await apiCall('/apimgmt/api/v1/api/external-api-specs/active', {
    method: 'GET'
  }, accessToken);
  return response || [];
};

// 1. 외부API 등록
export const registerExternalAPI = async (apiData: {
  apiName: string;
  apiDescription: string;
  apiIssuer: string;
  apiUrl: string;
  httpMethod: string;
  credentialId: string;
  parameters: Array<{
    paramName: string;
    paramType: string;
    isRequired: boolean;
    paramDescription: string;
    defaultValue: string;
    additionalFields: null;
  }>;
}, accessToken: string) => {
  return await apiCall('/apimgmt/api/v1/api/external-api-specs', {
    method: 'POST',
    body: JSON.stringify(apiData)
  }, accessToken);
};

// 2. 외부API 삭제
export const deleteExternalAPI = async (apiId: string, accessToken: string) => {
  return await apiCall(`/apimgmt/api/v1/api/external-api-specs/${apiId}`, {
    method: 'DELETE'
  }, accessToken);
};

// ==============================================
// 커스텀 API 서비스
// ==============================================

// 1. 커스텀API 생성요청 (간단 버전)
export const createCustomAPISimple = async (query: string, customApiId: string, accessToken: string) => {
  const params = new URLSearchParams();
  params.append('query', query);
  params.append('custom_api_id', customApiId);

  return await apiCall('/aifeature/api/ai/analyze-query-form', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });
};

// 1-2. 커스텀API 생성요청 (상세 버전)
export const createCustomAPI = async (apiData: {
  name: string;
  description: string;
  method: string;
  endpoint: string;
  parameters?: Array<{
    name: string;
    type: string;
    description: string;
    required: boolean;
  }>;
  headers?: Array<{
    name: string;
    value: string;
  }>;
  responseFormat?: string;
}, accessToken: string) => {
  return await apiCall('/customapi/api/custom-apis', {
    method: 'POST',
    body: JSON.stringify(apiData)
  }, accessToken);
};

// 2. 커스텀API 사용요청 (간단 버전)
export const executeCustomAPISimple = async (customApiName: string, query: string, accessToken: string, aiPlus?: string) => {
  let url = `/aifeature/api/ai/execute/${customApiName}?query=${encodeURIComponent(query)}`;
  if (aiPlus) {
    url += `&aiPlus=${encodeURIComponent(aiPlus)}`;
  }
  
  return await apiCall(url, {
    method: 'GET'
  }, accessToken);
};

// 2-2. 커스텀API 실행요청 (파라미터 버전)
export const executeCustomAPI = async (apiId: string, parameters: Record<string, any>, accessToken: string) => {
  return await apiCall(`/customapi/api/custom-apis/${apiId}/execute`, {
    method: 'POST',
    body: JSON.stringify({ parameters })
  }, accessToken);
};

// 3. 커스텀API 리스트 조회
export const getCustomAPIList = async (accessToken: string) => {
  const response = await apiCall('/customapi/api/custom-apis', {
    method: 'GET'
  }, accessToken);
  return response?.data || [];
};

// 3-2. 커스텀API 상세 정보 조회
export const getCustomAPIDetail = async (customApiId: string, accessToken: string) => {
  const response = await apiCall(`/customapi/api/custom-apis/${customApiId}`, {
    method: 'GET'
  }, accessToken);
  return response;
};

// 4. 사용자별 커스텀API 리스트 조회
export const getUserCustomAPIs = async (accessToken: string) => {
  return await apiCall('/customapi/api/user/custom-apis', {
    method: 'GET'
  }, accessToken);
};

// 5. 커스텀API 공유 요청
export const shareCustomAPI = async (customApiId: string, accessToken: string, share: boolean = true) => {
  return await apiCall(`/customapi/api/custom-apis/${customApiId}/share?share=${share}`, {
    method: 'PUT'
  }, accessToken);
};

// 5-2. 공유된 커스텀API 리스트 조회
export const getSharedCustomAPIs = async (accessToken: string) => {
  const response = await apiCall('/customapi/api/custom-apis/shared', {
    method: 'GET'
  }, accessToken);
  return response?.data || [];
};

// 6. 커스텀API 삭제
export const deleteCustomAPI = async (apiId: string, accessToken: string) => {
  return await apiCall(`/customapi/api/custom-apis/${apiId}`, {
    method: 'DELETE'
  }, accessToken);
};

// 7. 커스텀API 가져오기(Import)
export const importCustomAPI = async (customApiId: string, accessToken: string) => {
  return await apiCall(`/customapi/api/custom-apis/${customApiId}/import`, {
    method: 'POST'
  }, accessToken);
};

// ==============================================
// 인증 서비스 API
// ==============================================

// 로그인 API 호출 (백엔드 OAuth2 시작점)
export const initiateBackendLogin = (redirectUrl?: string) => {
  // 성공 후 리다이렉트할 URL을 파라미터로 추가
  const baseUrl = 'http://localhost:8080/gateway/users/api/auth/login';
  const targetUrl = redirectUrl || `${window.location.origin}/dashboard`;
  const loginUrl = `${baseUrl}?redirect_uri=${encodeURIComponent(targetUrl)}`;
  
  console.log('Redirecting to backend login:', loginUrl);
  window.location.href = loginUrl;
};

// 로그아웃 API 호출
export const logoutUser = async (accessToken: string) => {
  return await apiCall('/users/api/auth/logout', {
    method: 'POST'
  }, accessToken);
};

// ==============================================
// 결제 서비스 API
// ==============================================

// Toss 페이먼츠 구독 요청
export const subscribeToTossPayment = async (planName: string, accessToken: string) => {
  return await apiCall('/users/api/tosspay/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      planName,
      provider: 'TOSSPAY'
    })
  }, accessToken);
};