export default function LogoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-180px)] flex items-center justify-center">
      {children}
    </div>
  );
}