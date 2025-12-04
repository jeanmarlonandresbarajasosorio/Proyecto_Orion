const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function apiRegister(payload){
  const res = await fetch(`${API_URL}/auth/register`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });
  return res;
}

export async function apiLogin(email, password){
  const res = await fetch(`${API_URL}/auth/login`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email, password })
  });
  return res;
}

export async function apiRefresh(refreshToken){
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ refresh: refreshToken })
  });
  return res;
}

export async function apiRequestReset(email){
  return fetch(`${API_URL}/auth/reset`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ email })
  });
}

export async function apiChangePassword(body){
  return fetch(`${API_URL}/auth/change-password`, {
    method:"POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body)
  });
}
