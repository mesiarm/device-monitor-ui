interface MessageProps {
  type: 'success' | 'error';
  children: string;
}

export default function Message({ type, children }: MessageProps) {
  return <p role={type === 'error' ? 'alert' : 'status'}>{children}</p>;
}
