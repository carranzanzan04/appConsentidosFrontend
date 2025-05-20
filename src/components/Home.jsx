import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Hero Section */}
      <header className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
              <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
                <div className="sm:text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start">
                    <img
                      src="src/assets/consentidos1.jpg"
                      alt="Logo Consentidos"
                      className="h-24 w-auto mb-6 md:h-32 lg:h-50"
                    />
                  </div>
                  <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                    <span className="block">Cuidamos a tus</span>
                    <span className="block text-blue-600">
                      mascotas consentidas
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                    La mejor IPS veterinaria con atención especializada,
                    servicios integrales y todo el amor que tus mascotas
                    merecen.
                  </p>
                  <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                    <div className="rounded-md shadow">
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/register"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Crear cuenta
                      </Link>
                    </div>
                    <div className="ml-3 inline-flex rounded-md shadow">
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/login"
                        className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                      >
                        Iniciar sesión
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="src/assets/mascotas.jpg"
            alt="Mascotas felices"
          />
        </div>
      </header>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">
              Servicios
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para tu mascota
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Ofrecemos una amplia gama de servicios veterinarios de alta
              calidad.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Consultas Veterinarias",
                  description:
                    "Atención especializada para diagnóstico y tratamiento de tus mascotas.",
                  icon: "🐾",
                },
                {
                  name: "Vacunación",
                  description:
                    "Programa completo de vacunación para todas las etapas de vida.",
                  icon: "💉",
                },
                {
                  name: "Cirugías",
                  description:
                    "Procedimientos quirúrgicos con tecnología de punta y cuidado postoperatorio.",
                  icon: "🏥",
                },
                {
                  name: "Estética Canina",
                  description:
                    "Baños terapéuticos, cortes de pelo y cuidado de uñas profesional.",
                  icon: "✂️",
                },
                {
                  name: "Laboratorio Clínico",
                  description:
                    "Análisis clínicos y pruebas diagnósticas con resultados rápidos y confiables.",
                  icon: "🔬",
                },
                {
                  name: "Hospitalización",
                  description:
                    "Áreas especializadas para recuperación con monitoreo 24/7.",
                  icon: "🛌",
                },
              ].map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg text-3xl">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="block">¿Listo para consentir a tu mascota?</span>
            <span className="block text-blue-600">
              Regístrate ahora y obtén un 10% de descuento en la primera
              consulta.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                style={{ textDecoration: "none" }}
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Crear cuenta
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                style={{ textDecoration: "none" }}
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav
            className="-mx-5 -my-2 flex flex-wrap justify-center"
            aria-label="Footer"
          >
            <div className="px-5 py-2">
              <Link
                style={{ textDecoration: "none" }}
                to="/about"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Sobre nosotros
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link
                style={{ textDecoration: "none" }}
                to="/services"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Servicios
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link
                style={{ textDecoration: "none" }}
                to="/contact"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Contacto
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link
                style={{ textDecoration: "none" }}
                to="/privacy"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                Privacidad
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} Consentidos IPS Veterinaria. Todos
            los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
