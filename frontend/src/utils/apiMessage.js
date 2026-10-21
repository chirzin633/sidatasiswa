export function getApiMessage(error, fallback) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.data?.message) {
    return error.data.message;
  }
  return fallback;
}
