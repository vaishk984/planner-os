import '../globals.css'

export const metadata = {
    title: 'Share Your Vision | PlannerOS',
    description: 'Tell us about your dream event',
}

export default function IntakeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className="font-sans bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-screen">
                {children}
            </body>
        </html>
    )
}
