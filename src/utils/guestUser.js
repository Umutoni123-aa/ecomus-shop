// Generates and persists a stable guest user ID in localStorage.
// The API requires a valid MongoDB ObjectId format (24 hex chars).
function createGuestId() {
  const hex = () => Math.floor(Math.random() * 16).toString(16);
  return Array.from({ length: 24 }, hex).join("");
}

const stored = localStorage.getItem("ecomus_guest_id");
export const GUEST_USER_ID = stored ?? (() => {
  const id = createGuestId();
  localStorage.setItem("ecomus_guest_id", id);
  return id;
})();
