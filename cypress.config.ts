import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Asegúrate de que este es el URL correcto
    supportFile: false, // Opcional, dependiendo de tu configuración
    // Otras configuraciones...
  },
});
