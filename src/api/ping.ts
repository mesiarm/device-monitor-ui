const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * Uloží ping zariadenia: POST /api/devices/{uuid}/ping
 * (zadanie uvádza POST /api/ping, ale backend vystavuje cestu s uuid v URL).
 */
export async function sendPing(uuid: string, batteryPercent: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/devices/${encodeURIComponent(uuid.trim())}/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ battery_percent: batteryPercent }),
    });
  } catch {
    throw new ApiError('Server je nedostupný. Skontroluj, či API beží.');
  }

  if (response.ok) return;

  if (response.status === 404) {
    throw new ApiError('Zariadenie s týmto UUID neexistuje.', 404);
  }

  const body: ErrorBody | null = await response.json().catch(() => null);

  if (response.status === 422 && body?.errors) {
    throw new ApiError(Object.values(body.errors).flat().join(' '), 422);
  }

  throw new ApiError(body?.message ?? `Chyba servera (${response.status}).`, response.status);
}
