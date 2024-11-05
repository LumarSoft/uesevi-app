const UnderConstructionModule = () => {
  return (
    <section className="bg-gray-100">
      <div className="min-h-screen flex flex-col justify-center items-center">
        <img
          src="https://www.svgrepo.com/show/426192/cogs-settings.svg"
          alt=""
          className="mb-8 h-40"
        />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-700 mb-4">
          Pagina en mantenimiento
        </h1>
        <div className="text-center mb-8 max-w-5xl mx-auto">
          <p className="text-gray-500 text-lg md:text-xl lg:text-2xl">
            De parte del equipo de <b>UESEVI</b> queremos informarles que
            estamos trabajando para mejorar la experiencia del usuario.
            ¡Manténganse al tanto!
          </p>
        </div>
      </div>
    </section>
  );
};

export default UnderConstructionModule;
