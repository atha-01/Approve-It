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

export async function getMyIdeas(token) {
  const response = await fetch(API_BASE_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to fetch your submitted ideas."
    );
  }

  return result;
}

export async function getIdeaById(id, token) {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to fetch idea details.");
  }

  return result;
}
export async function updateIdeaReview(id, status, token, feedback = "") {
  const response = await fetch(`${API_BASE_URL}/${id}/review`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status,
      feedback,
    }),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to update idea status."
    );
  }

  return result;
}
export async function getIdeasForReview(token) {
  const response = await fetch(`${API_BASE_URL}/review`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to fetch ideas for review."
    );
  }

  return result;
}
export async function getIdeaPdf(id, token) {
  const response = await fetch(`${API_BASE_URL}/${id}/pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));

    throw new Error(
      result.message || "Unable to fetch the PDF."
    );
  }

  return await response.blob();
}