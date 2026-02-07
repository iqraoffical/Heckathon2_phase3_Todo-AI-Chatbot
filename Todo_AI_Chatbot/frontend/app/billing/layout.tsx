export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-240px)]">
      {children}
    </div>
  );
}