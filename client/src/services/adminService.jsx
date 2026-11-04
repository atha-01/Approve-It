const API_BASE_URL = "/api/admin";

export async function getTeacherApplications(token) {
  const response = await fetch(
    `${API_BASE_URL}/teacher-applications`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch teacher applications."
    );
  }

  return result;
}

export async function approveTeacherApplication(appId, token) {
  const response = await fetch(
    `${API_BASE_URL}/teacher-applications/${appId}/approve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to approve teacher.");
  }

  return result;
}

export async function rejectTeacherApplication(appId, reason, token) {
  const response = await fetch(
    `${API_BASE_URL}/teacher-applications/${appId}/reject`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reason }),
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Failed to reject teacher.");
  }

  return result;
}