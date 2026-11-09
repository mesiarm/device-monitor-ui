import { FormEvent, useState } from 'react';
import { sendPing } from '../api/ping';
import { FormErrors, validate } from '../validation';
import Message from './Message';

type Status =
  | { type: 'idle' }
  | { type: 'success' }
  | { type: 'error'; message: string };

const inputClass =
  'rounded border border-gray-300 px-3 py-2 aria-invalid:border-red-500 disabled:bg-gray-100';

export default function PingForm() {
  const [uuid, setUuid] = useState('');
  const [batteryPercent, setBatteryPercent] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ type: 'idle' });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus({ type: 'idle' });

    const validationErrors = validate({ uuid, batteryPercent });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      await sendPing(uuid, Number(batteryPercent));
      setStatus({ type: 'success' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Neznáma chyba.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4 flex flex-col gap-1">
        <label htmlFor="uuid" className="text-sm font-medium text-gray-700">
          uuid
        </label>
        <input
          id="uuid"
          type="text"
          className={inputClass}
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          aria-invalid={Boolean(errors.uuid)}
          disabled={loading}
        />
        {errors.uuid && <span className="text-sm text-red-600">{errors.uuid}</span>}
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label htmlFor="battery_percent" className="text-sm font-medium text-gray-700">
          battery_percent
        </label>
        <input
          id="battery_percent"
          type="number"
          className={inputClass}
          value={batteryPercent}
          onChange={(e) => setBatteryPercent(e.target.value)}
          aria-invalid={Boolean(errors.batteryPercent)}
          disabled={loading}
        />
        {errors.batteryPercent && (
          <span className="text-sm text-red-600">{errors.batteryPercent}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Send'}
      </button>

      {status.type === 'success' && <Message type="success">Data sent successfully</Message>}
      {status.type === 'error' && <Message type="error">{status.message}</Message>}
    </form>
  );
}
