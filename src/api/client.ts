const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
}

export async function getPool() {
  const response = await apiFetch("/api/pool");
  if (!response.ok) throw new Error(`Failed to get pool (${response.status})`);
  return response.json();
}

export async function resetPool() {
  const response = await apiFetch("/api/pool/reset", { method: "POST" });
  if (!response.ok) throw new Error(`Failed to reset pool (${response.status})`);
  return response.json();
}

export async function loginUser(email: string, name?: string) {
  const response = await apiFetch("/api/members/login", {
    method: "POST",
    body: JSON.stringify({ email, ...(name ? { name } : {}) }),
  });
  if (!response.ok) throw new Error(`Failed to log in (${response.status})`);
  return response.json();
}

export async function inviteMember(name: string, email: string, role: string) {
  const response = await apiFetch("/api/members/invite", {
    method: "POST",
    body: JSON.stringify({ name, email, role }),
  });
  if (!response.ok) throw new Error(`Failed to invite member (${response.status})`);
  const member = await response.json();
  return {
    id: member.id,
    name: member.name,
    email: member.email ?? member.paypal_email,
    role: member.role,
  };
}

export async function getMembers() {
  const response = await apiFetch("/api/members/");
  if (!response.ok) throw new Error(`Failed to get members (${response.status})`);
  const members = await response.json();
  return members.map((member: any) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    email: member.email ?? member.paypal_email,
  }));
}

export async function deleteMember(member_id: number | string) {
  const response = await apiFetch(`/api/members/${member_id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Failed to delete member (${response.status})`);
  return response.json();
}

export async function makeContribution(member_name: string, amount: number) {
  const orderResponse = await apiFetch("/api/contributions/order", {
    method: "POST",
    body: JSON.stringify({ member_name, amount }),
  });
  if (!orderResponse.ok) {
    throw new Error(`Failed to create contribution order (${orderResponse.status})`);
  }

  const order = await orderResponse.json();
  const captureResponse = await apiFetch("/api/contributions/capture", {
    method: "POST",
    body: JSON.stringify({ order_id: order.order_id, amount, member_name }),
  });
  if (!captureResponse.ok) {
    throw new Error(`Failed to capture contribution (${captureResponse.status})`);
  }
  return captureResponse.json();
}

export async function getTrustLog() {
  const response = await apiFetch("/api/trustlog/");
  if (!response.ok) throw new Error(`Failed to get trust log (${response.status})`);
  return response.json();
}

export async function searchProducts(query: string) {
  const response = await apiFetch("/api/smartbuy/search", {
    method: "POST",
    body: JSON.stringify({ query }),
  });
  if (!response.ok) throw new Error(`Failed to search products (${response.status})`);
  return response.json();
}

export async function triggerKillSwitch() {
  const response = await apiFetch("/api/killswitch/pause", { method: "POST" });
  if (!response.ok) throw new Error(`Failed to trigger kill switch (${response.status})`);
  return response.json();
}
