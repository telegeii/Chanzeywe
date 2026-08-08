/**
 * Thin fetch wrapper for the PHP API.
 * Every endpoint returns { success, data } or { success:false, error }.
 * All calls include credentials so the admin session cookie is sent.
 */

// Sent on every mutating request as a lightweight CSRF defence: a cross-site
// <form> POST (classic CSRF) cannot set custom headers, so the server-side
// require_admin() check rejects any state-changing request missing this.
const FETCH_HEADER = { "X-Requested-With": "fetch" };

async function handle(res) {
  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Server returned an unexpected response (${res.status})`);
  }
  if (!res.ok || !body.success) {
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  return body.data;
}

export const apiGet = (path) =>
  fetch(`/api${path}`, { credentials: "include" }).then(handle);

export const apiPost = (path, body) =>
  fetch(`/api${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...FETCH_HEADER },
    body: JSON.stringify(body),
  }).then(handle);

// Multipart submission (file uploads) — no Content-Type header so the
// browser can set the multipart boundary itself.
export const apiPostForm = (path, formData) =>
  fetch(`/api${path}`, {
    method: "POST",
    credentials: "include",
    headers: { ...FETCH_HEADER },
    body: formData,
  }).then(handle);

export const apiPut = (path, id, body) =>
  fetch(`/api${path}?id=${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...FETCH_HEADER },
    body: JSON.stringify(body),
  }).then(handle);

export const apiDelete = (path, id) =>
  fetch(`/api${path}?id=${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: { ...FETCH_HEADER },
  }).then(handle);
