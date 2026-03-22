import fs from 'fs';
import { parse } from 'csv-parse/sync';

const MI_TAG = "tu-tag-20"; 

try {
  const contenido = fs.readFileSync('./descarga.csv', 'utf8');
  
  
    // CONFIGURACIÓN ULTRA-FLEXIBLE
  const productosSucios = parse(contenido, { 
    columns: true, 
    skip_empty_lines: true, 
    trim: true,
    relax_column_count: true, // Ignora si sobran columnas
    relax_quotes: true,       // IGNORA EL ERROR DE LAS COMILLAS (Tu error actual)
    quote: '"',               // Define qué es una comilla
    escape: '"',              // Maneja comillas dobles dentro de textos
    skip_records_with_error: true // Si una línea está MUY rota, se la salta y sigue con la otra
  });


  const productosLimpios = productosSucios.map((item, index) => {
    const keys = Object.keys(item);
    
    // BUSCADOR FLEXIBLE DE COLUMNAS
    const keyNombre = keys.find(k => k.includes('size-base') || k.includes('title')) || "";
    const keyImagen = keys.find(k => k.includes('image') && k.includes('src')) || "";
    const keyLink = keys.find(k => k.includes('link') && k.includes('href')) || "";

    const nombreRaw = String(item[keyNombre] || "");
    const imagenRaw = String(item[keyImagen] || "");
    const linkRaw = String(item[keyLink] || "");

    // Si el nombre es muy corto o no hay imagen, saltamos
    if (nombreRaw.length < 20 || !imagenRaw.includes("http")) return null;

    // Buscamos el precio en varias columnas posibles que genera el scraper
    const precioFinal = item["a-offscreen"] || item["a-price"] || item["a-offscreen 2"] || "Consultar";

    return {
      id: (index + 1).toString(),
      nombre: nombreRaw,
      specs: "Ver especificaciones en Amazon",
      precio: String(precioFinal),
      link: linkRaw.startsWith("http") ? `${linkRaw}&tag=${MI_TAG}` : `https://www.amazon.com${linkRaw}&tag=${MI_TAG}`,
      imagen: imagenRaw,
      categoria: "Laptop"
    };
  }).filter(p => p !== null);

  // Guardamos en la ruta de tu proyecto Astro
fs.writeFileSync('./src/data/products.json', JSON.stringify(productosLimpios, null, 2));

// ESTA ES LA LÍNEA QUE TE AVISA:
  console.log(`\n🚀 ¡Éxito total!`);
  console.log(`✅ Se procesaron ${productosLimpios.length} laptops correctamente.`);
  console.log(`📂 Archivo actualizado en: ./src/data/products.json\n`);


} catch (e) {
  console.error("Error crítico:", e.message);
}
