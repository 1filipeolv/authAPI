import '../frontend/src/styles/globals.css'

export const metadata = {
  title: 'AuthAPI Dashboard',
  description: 'Authentication Project',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
