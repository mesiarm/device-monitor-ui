import { useState } from 'react';

export default function PingForm() {
  const [uuid, setUuid] = useState('');
  const [batteryPercent, setBatteryPercent] = useState('');

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate>
      <div>
        <label htmlFor="uuid">uuid</label>
        <input
          id="uuid"
          type="text"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="battery_percent">battery_percent</label>
        <input
          id="battery_percent"
          type="number"
          value={batteryPercent}
          onChange={(e) => setBatteryPercent(e.target.value)}
        />
      </div>

      <button type="submit">Send</button>
    </form>
  );
}
