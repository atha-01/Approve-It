const API_BASE_URL = "/api/auth";

async function sendAuthenticationRequest(endpoint, userData) {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Authentication request failed.");
  }

  return result;
}

export function registerStudent({ name, email, password }) {
  return sendAuthenticationRequest("register", {
    name,
    email,
    password,
  });
}


export function loginUser({ email, password, role }) {
  return sendAuthenticationRequest("login", {
    email,
    password,
    role,
  });
}

export function registerTeacher({email,password,name}){
  return sendAuthenticationRequest("teacher-register",{
    email,
    name,
    password
  })
}

export async function getCurrentUser(token) {
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Unable to verify your session.");
  }

  return result.user;
}