import { FormEvent, useState } from 'react';
import { FormErrors, validate } from '../validation';

export default function PingForm() {
  const [uuid, setUuid] = useState('');
  const [batteryPercent, setBatteryPercent] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const validationErrors = validate({ uuid, batteryPercent });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    // TODO: odoslať dáta na API
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
        />
        {errors.batteryPercent && <span>{errors.batteryPercent}</span>}
      </div>

      <button type="submit">Send</button>
    </form>
  );
}
