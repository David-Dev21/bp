import { z } from "zod";

// Validaciones individuales para campos específicos
export const cedulaIdentidadSchema = z
  .string()
  .min(1, "La cédula de identidad es requerida")
  .max(20, "La cédula de identidad no puede tener más de 20 caracteres")
  .regex(/^[A-Za-z0-9\-]+$/, "La cédula de identidad solo puede contener letras, números y guiones")
  .transform((val) => val.trim().toUpperCase());

export const codigoDenunciaSchema = z
  .string()
  .min(1, "El Código de Denuncia es requerido")
  .max(20, "El Código de Denuncia no puede tener más de 20 caracteres")
  .regex(/^[A-Za-z0-9\-\/]+$/, "El Código de Denuncia solo puede contener letras, números, guiones y barras")
  .transform((val) => val.trim().toUpperCase());

// Validaciones para campos de registro
export const nombresSchema = z
  .string()
  .min(1, "Los nombres son requeridos")
  .max(50, "Los nombres no pueden tener más de 50 caracteres")
  .regex(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/, "Los nombres solo pueden contener letras y espacios")
  .transform((val) => val.trim());

export const apellidosSchema = z
  .string()
  .min(1, "Los apellidos son requeridos")
  .max(50, "Los apellidos no pueden tener más de 50 caracteres")
  .regex(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/, "Los apellidos solo pueden contener letras y espacios")
  .transform((val) => val.trim());

export const celularSchema = z
  .string()
  .min(1, "El celular es requerido")
  .length(8, "El celular debe tener exactamente 8 dígitos")
  .regex(/^[0-9]+$/, "El celular solo puede contener números")
  .transform((val) => val.trim());

export const correoSchema = z
  .string()
  .email("Ingresa un correo electrónico válido")
  .max(100, "El correo no puede tener más de 100 caracteres")
  .transform((val) => val.trim().toLowerCase())
  .optional()
  .or(z.literal(""));

export const fechaNacimientoSchema = z
  .string()
  .min(1, "Debes seleccionar tu fecha de nacimiento")
  .refine((date) => {
    if (!date || date === "") return false; // NO permitir vacío
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

    const [año, mes, dia] = date.split("-").map(Number);
    const fechaNac = new Date(año, mes - 1, dia); // mes - 1 porque Date usa 0-11
    const hoy = new Date();

    // Calcular edad exacta
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (mesActual < fechaNac.getMonth() || (mesActual === fechaNac.getMonth() && diaActual < fechaNac.getDate())) {
      edad--;
    }

    return edad >= 18;
  }, "Debes ser mayor de 18 años");

export const zonaSchema = z
  .string()
  .min(1, "La zona es requerida")
  .max(100, "La zona no puede tener más de 100 caracteres")
  .transform((val) => val.trim());

export const calleSchema = z
  .string()
  .min(1, "La calle es requerida")
  .max(100, "La calle no puede tener más de 100 caracteres")
  .transform((val) => val.trim());

export const numeroViviendaSchema = z
  .string()
  .min(1, "El número de vivienda es requerido")
  .max(20, "El número no puede tener más de 20 caracteres")
  .regex(/^[A-Za-z0-9\-#]+$/, "El número solo puede contener letras, números, guiones y #")
  .transform((val) => val.trim());

export const referenciaSchema = z
  .string()
  .min(1, "La referencia es requerida")
  .max(200, "La referencia no puede tener más de 200 caracteres")
  .transform((val) => val.trim());

// Validaciones para contactos de emergencia
export const parentescoSchema = z.string().min(1, "El parentesco es requerido").max(30, "El parentesco no puede tener más de 30 caracteres");

export const nombreContactoSchema = z
  .string()
  .min(1, "El nombre del contacto es requerido")
  .max(100, "El nombre no puede tener más de 100 caracteres")
  .regex(/^[A-Za-zÀ-ÿ\u00f1\u00d1\s]+$/, "El nombre solo puede contener letras y espacios")
  .transform((val) => val.trim());

export const telefonoContactoSchema = z
  .string()
  .min(1, "El teléfono es requerido")
  .length(8, "El teléfono debe tener exactamente 8 dígitos")
  .regex(/^[0-9]+$/, "El teléfono solo puede contener números")
  .transform((val) => val.trim());
