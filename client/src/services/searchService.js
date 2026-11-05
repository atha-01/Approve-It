const API_BASE_URL = "/api/search";

export async function searchResources(query, token) {
  const params = new URLSearchParams({
    q: query.trim(),
  });

  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    method: "GET",
    headers,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to search for resources."
    );
  }

  // Support either an array response or an object containing results.
  if (Array.isArray(result)) {
    return result;
  }

  return result.results || [];
}