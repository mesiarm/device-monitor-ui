interface MessageProps {
  type: 'success' | 'error';
  children: string;
}

const styles = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
};

export default function Message({ type, children }: MessageProps) {
  return (
    <p role={type === 'error' ? 'alert' : 'status'} className={`mt-4 rounded p-3 ${styles[type]}`}>
      {children}
    </p>
  );
}
