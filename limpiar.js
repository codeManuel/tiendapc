import fs from 'fs';
import { parse } from 'csv-parse/sync';

const MI_TAG = "tu-tag-20"; 

try {
  const contenido = fs.readFileSync('./descarga.csv', 'utf8');
  const productosSucios = parse(contenido, { columns: true, skip_empty_lines: true, trim: true });

  const productosLimpios = productosSucios.map((item, index) => {
    // BUSCADOR FLEXIBLE DE COLUMNAS
    const keys = Object.keys(item);
    
    // Buscamos la columna que tenga el nombre (suele tener 'size-base')
    const keyNombre = keys.find(k => k.includes('size-base') || k.includes('title')) || "";
    // Buscamos la columna de la imagen (que tenga 'image' y 'src')
    const keyImagen = keys.find(k => k.includes('image') && k.includes('src')) || "";
    // Buscamos la columna del link (que tenga 'link' y 'href')
    const keyLink = keys.find(k => k.includes('link') && k.includes('href')) || "";

    const nombreRaw = String(item[keyNombre] || "");
    const imagenRaw = String(item[keyImagen] || "");
    const linkRaw = String(item[keyLink] || "");

    // Si el nombre es muy corto (basura) o no hay imagen, lo saltamos
    if (nombreRaw.length < 20 || !imagenRaw.includes("http")) return null;

    return {
      id: (index + 1).toString(),
      nombre: nombreRaw,
      specs: "Ver especificaciones en Amazon",
      precio: String(item["a-offscreen"] || item["a-price"] || "Consultar"),
      link: linkRaw.startsWith("http") ? `${linkRaw}&tag=${MI_TAG}` : `https://www.amazon.com${linkRaw}&tag=${MI_TAG}`,
      imagen: imagenRaw,
      categoria: "Laptop"
    };
  }).filter(p => p !== null);

  fs.writeFileSync('./src/data/products.json', JSON.stringify(productosLimpios, null, 2));
  console.log(`¡Vencimos! 🚀 Se extrajeron ${productosLimpios.length} laptops reales.`);

} catch (e) {
  console.error("Error:", e.message);
}
