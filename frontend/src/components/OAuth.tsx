const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export default function OAuth() {
  return (
    <button
      type="button"
      onClick={() => { window.location.href = `${API_URL}/api/auth/google/login`; }}
      className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}
