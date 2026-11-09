import { FormEvent, useState } from 'react';
import { sendPing } from '../api/ping';
import { FormErrors, validate } from '../validation';

type Status =
  | { type: 'idle' }
  | { type: 'success' }
  | { type: 'error'; message: string };

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
      <div>
        <label htmlFor="uuid">uuid</label>
        <input
          id="uuid"
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          aria-invalid={Boolean(errors.uuid)}
          disabled={loading}
        />
        {errors.uuid && <span>{errors.uuid}</span>}
      </div>

      <div>
        <label htmlFor="battery_percent">battery_percent</label>
        <input
          id="battery_percent"
          type="number"
          value={batteryPercent}
          onChange={(e) => setBatteryPercent(e.target.value)}
          aria-invalid={Boolean(errors.batteryPercent)}
          disabled={loading}
        />
        {errors.batteryPercent && <span>{errors.batteryPercent}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </button>

      {status.type === 'success' && <p role="status">Data sent successfully</p>}
      {status.type === 'error' && <p role="alert">{status.message}</p>}
    </form>
  );
}
