import React from 'react';
import PageLayout from '../components/layout/PageLayout';

const Acerca = () => {
  return (
    <PageLayout>
      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-sm uppercase tracking-widest text-purple-500 font-semibold">
            Acerca de SubastArte
          </p>
          <h1 className="text-4xl font-bold text-gray-900">
            Plataforma de subastas para artistas ecuatorianos
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Este espacio contará con la historia del proyecto, nuestro equipo y el impacto que buscamos
            en la comunidad artística. Próximamente añadiremos información detallada, llamados a la acción
            y enlaces de contacto para instituciones aliadas y nuevos artistas.
          </p>
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-left space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">Próximas actualizaciones</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Historia del proyecto y metas de impacto social.</li>
              <li>Equipo detrás de SubastArte y aliados estratégicos.</li>
              <li>Proceso para que instituciones organicen subastas benéficas.</li>
            </ul>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Acerca;
