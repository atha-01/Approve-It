const API_BASE_URL = "/api/ideas";

export async function submitIdea({ formData, token }) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to submit your idea.");
  }

  return result;
}