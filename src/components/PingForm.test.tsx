import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PingForm from './PingForm';

const UUID = '550e8400-e29b-41d4-a716-446655440000';

afterEach(() => vi.restoreAllMocks());

async function fill(uuid: string, battery: string) {
  const user = userEvent.setup();
  if (uuid) await user.type(screen.getByLabelText('UUID zariadenia'), uuid);
  if (battery) await user.type(screen.getByLabelText('Úroveň batérie (%)'), battery);
  await user.click(screen.getByRole('button', { name: 'Odoslať' }));
}

describe('PingForm', () => {
  it('zobrazí chyby validácie a neodošle request', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch');
    render(<PingForm />);
    await fill('', '150');

    expect(screen.getByText('UUID je povinné.')).toBeInTheDocument();
    expect(screen.getByText(/od 0 do 100/)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('pošle ping a zobrazí úspech', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ status: 'ok' }), { status: 201 }));
    render(<PingForm />);
    await fill(UUID, '85');

    expect(await screen.findByText('Údaje boli úspešne odoslané')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/devices/${UUID}/ping`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ battery_percent: 85 }) }),
    );
  });

  it('zobrazí chybu pri neznámom zariadení (404)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 404 }));
    render(<PingForm />);
    await fill(UUID, '50');

    expect(await screen.findByRole('alert')).toHaveTextContent('Zariadenie s týmto UUID neexistuje.');
  });

  it('zobrazí chybu pri nedostupnom serveri', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));
    render(<PingForm />);
    await fill(UUID, '50');

    expect(await screen.findByRole('alert')).toHaveTextContent('Server je nedostupný');
  });
});
