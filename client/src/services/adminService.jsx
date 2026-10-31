
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
