import PingForm from './components/PingForm';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <main className="mx-auto mt-12 max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold text-gray-900">Device Monitor</h1>
        <p className="mb-6 text-sm text-gray-500">Odoslanie údajov o zariadení</p>
        <PingForm />
      </main>
    </div>
  );
}
