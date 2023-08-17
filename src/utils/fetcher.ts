export const fetcher = (path: string, token: string, opts?: RequestInit) =>
  fetch(`${process.env.NEXT_PUBLIC_NITRIC_API_BASE_URL}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
