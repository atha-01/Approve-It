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


export async function getIdeasForDatabase(token, filters) {

  // filters is simply an object containing the user's selected filters. Each if checks whether a filter was provided before adding it to the URL.

    const params = new URLSearchParams();

    // Add academic year if provided
    if (filters && filters.academicYear) {
        params.append("academicYear", filters.academicYear);
    }

    // Add status if provided
    if (filters && filters.status && filters.status !== "all") {
        params.append("status", filters.status);
    }

    // Add search keyword if provided
    if (filters && filters.query) {
        params.append("query", filters.query);
    }

    // Create the request URL
    const url = `${API_BASE_URL}/database?${params.toString()}`;

    // Send request to backend
    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    // Read the response
    const result = await response.json().catch(() => []);

    // Check for errors
    if (!response.ok) {
        throw new Error(
            result.message || "Unable to fetch ideas from the database."
        );
    }

    // Return the ideas
    return result;
}