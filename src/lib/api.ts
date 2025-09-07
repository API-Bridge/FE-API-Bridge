// API Base URL
const API_BASE_URL = 'http://localhost:8080/gateway';

// API 호출 헬퍼 함수
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken'); // 토큰 저장소에서 가져오기
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
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

// 1. 로그인
export const userLogin = async () => {
  return await apiCall('/users/api/auth/login', {
    method: 'GET'
  });
};

// 2. 사용자 개인 AI 키 등록
export const registerUserAIKey = async (secretName: string, secretValue: string, description: string) => {
  return await apiCall('/users/api/secrets', {
    method: 'POST',
    body: JSON.stringify({
      secretName,
      secretValue,
      description
    })
  });
};

// 3. 사용자 개인 AI키 리스트 조회
export const getUserAIKeys = async () => {
  return await apiCall('/users/api/secrets/arn', {
    method: 'GET'
  });
};

// 4. 사용자 개인 API키 삭제
export const deleteUserAIKey = async (keyId: string) => {
  return await apiCall(`/users/api/secrets/${keyId}`, {
    method: 'DELETE'
  });
};

// ==============================================
// 외부 API 서비스
// ==============================================

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
}) => {
  return await apiCall('/apimgmt/api/v1/api/external-api-specs', {
    method: 'POST',
    body: JSON.stringify(apiData)
  });
};

// 2. 외부API 삭제
export const deleteExternalAPI = async (apiId: string) => {
  return await apiCall(`/apimgmt/api/v1/api/external-api-specs/${apiId}`, {
    method: 'DELETE'
  });
};

// ==============================================
// 커스텀 API 서비스
// ==============================================

// 1. 커스텀API 생성요청 (간단 버전)
export const createCustomAPISimple = async (query: string, customApiId: string) => {
  const formData = new FormData();
  formData.append('query', query);
  formData.append('custom_api_id', customApiId);

  return await apiCall('/aifeature/api/ai/analyze-query-form', {
    method: 'POST',
    headers: {
      // FormData 사용시 Content-Type 헤더 제거 (자동 설정됨)
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData
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
}) => {
  return await apiCall('/customapi/api/custom-apis', {
    method: 'POST',
    body: JSON.stringify(apiData)
  });
};

// 2. 커스텀API 사용요청 (간단 버전)
export const executeCustomAPISimple = async (customApiName: string, query: string, aiPlus?: string) => {
  let url = `/aifeature/api/ai/execute/${customApiName}?query=${encodeURIComponent(query)}`;
  if (aiPlus) {
    url += `&aiPlus=${encodeURIComponent(aiPlus)}`;
  }
  
  return await apiCall(url, {
    method: 'GET'
  });
};

// 2-2. 커스텀API 실행요청 (파라미터 버전)
export const executeCustomAPI = async (apiId: string, parameters: Record<string, any>) => {
  return await apiCall(`/customapi/api/custom-apis/${apiId}/execute`, {
    method: 'POST',
    body: JSON.stringify({ parameters })
  });
};

// 3. 커스텀API 리스트 조회
export const getCustomAPIList = async () => {
  return await apiCall('/customapi/api/custom-apis', {
    method: 'GET'
  });
};

// 4. 사용자별 커스텀API 리스트 조회
export const getUserCustomAPIs = async () => {
  return await apiCall('/customapi/api/user/custom-apis', {
    method: 'GET'
  });
};

// 5. 커스텀API 공유 요청
export const shareCustomAPI = async (customApiName: string, share: boolean = true) => {
  return await apiCall(`/customapi/api/custom-apis/${customApiName}/share?share=${share}`, {
    method: 'PUT'
  });
};

// 5-2. 공유된 커스텀API 리스트 조회
export const getSharedCustomAPIs = async () => {
  return await apiCall('/customapi/api/custom-apis/shared', {
    method: 'GET'
  });
};

// 6. 커스텀API 삭제
export const deleteCustomAPI = async (apiId: string) => {
  return await apiCall(`/customapi/api/custom-apis/${apiId}`, {
    method: 'DELETE'
  });
};