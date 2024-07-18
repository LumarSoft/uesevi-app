export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <p>Navbar</p>
      {children}
    </div>
  );
}
