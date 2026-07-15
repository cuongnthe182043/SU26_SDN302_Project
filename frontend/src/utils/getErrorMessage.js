// Extracts a human-readable message from an axios error, falling back to a
// generic message when the backend did not return one.
export default function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.message || error?.message || fallback;
}
