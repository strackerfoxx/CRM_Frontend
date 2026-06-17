import { Providers } from "./providers"
import { BusinessProvider } from "./context/BusinessProvider";
import { UserProvider } from "./context/UserProvider";
import { AppointmentProvider } from "./context/AppointmentProvider";
import { ClientProvider } from "./context/ClientProvider";
import { ServiceProvider } from "./context/ServiceProvider";
import { TeamProvider } from "./context/TeamProvider";
import { DrawerProvider } from "./context/DrawerProvider";
import { ProfesionalProvider } from "./context/ProfesionalsProvider";
import "./globals.css";

export const metadata = {
  title: "Aera",
  description: "Administra tu negocio desde un solo lugar. Gestiona citas, consulta tu calendario, revisa la información de tus clientes y mantén el control de tu operación diaria de forma rápida y organizada.",
  icons: {
    icon: '/icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
          <UserProvider>
            <BusinessProvider>
              <TeamProvider>
                <ServiceProvider>
                  <AppointmentProvider>
                    <ClientProvider>
                      <DrawerProvider>
                        <ProfesionalProvider>
                          <Providers>{children}</Providers>
                        </ProfesionalProvider>
                      </DrawerProvider>
                    </ClientProvider>
                  </AppointmentProvider>
                </ServiceProvider>
              </TeamProvider>
            </BusinessProvider>
          </UserProvider>
      </body>
    </html>
  )
}
