import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import re

# --- CONFIGURACIÓN ---
URL_BASE = "https://estudiodecarolina.com/"
CARPETA_PRINCIPAL = "Cuadros_Organizados"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
}

def limpiar_nombre(nombre):
    """Limpia el texto para que sea un nombre de carpeta válido."""
    return re.sub(r'[\\/*?:"<>|\n\r]', "", nombre).strip()

def descargar_imagen(url_imagen, ruta_destino):
    """Descarga y guarda una imagen."""
    try:
        respuesta = requests.get(url_imagen, headers=HEADERS, stream=True, timeout=10)
        if respuesta.status_code == 200:
            with open(ruta_destino, 'wb') as archivo:
                for chunk in respuesta.iter_content(1024):
                    archivo.write(chunk)
            return True
    except Exception:
        pass
    return False

def procesar_pagina_detalle(url_detalle, ruta_subcarpeta):
    """Entra en el enlace del cuadro y descarga TODAS las imágenes en la subcarpeta 'Detalles'."""
    try:
        respuesta = requests.get(url_detalle, headers=HEADERS, timeout=10)
        if respuesta.status_code != 200:
            return
    except Exception:
        return

    soup = BeautifulSoup(respuesta.text, 'html.parser')
    contenedor_principal = soup.find('main') or soup.find(id='main') or soup.find(id='content') or soup.find('article') or soup
    
    imagenes = contenedor_principal.find_all('img')
    urls_descargadas = set()
    contador = 1

    for img in imagenes:
        src = img.get('data-src') or img.get('data-lazy-src') or img.get('src')
        if not src:
            continue
            
        url_imagen = urljoin(url_detalle, src)
        
        # Filtro para ignorar logos e iconos
        if any(palabra in url_imagen.lower() for palabra in ['logo', 'icon', 'avatar', 'instagram', 'facebook', 'menu']):
            continue
            
        if url_imagen in urls_descargadas:
            continue
            
        urls_descargadas.add(url_imagen)

        extension = url_imagen.split('.')[-1].split('?')[0]
        if extension.lower() not in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
            extension = 'jpg'
            
        # Nombre enumerado: 1.jpg, 2.jpg...
        nombre_archivo = f"{contador}.{extension}"
        ruta_imagen = os.path.join(ruta_subcarpeta, nombre_archivo)
        
        if descargar_imagen(url_imagen, ruta_imagen):
            contador += 1

    # Extraer y devolver el texto de la página para guardarlo fuera
    textos = contenedor_principal.get_text(separator="\n", strip=True)
    return textos

def extraer_galeria(url_base):
    print(f"Explorando: {url_base}")
    respuesta = requests.get(url_base, headers=HEADERS)
    soup = BeautifulSoup(respuesta.text, 'html.parser')
    
    if not os.path.exists(CARPETA_PRINCIPAL):
        os.makedirs(CARPETA_PRINCIPAL)

    enlaces_procesados = set()
    
    contenedores = soup.find_all(lambda tag: tag.name in ['div', 'article', 'li', 'figure'] and 
                                 tag.has_attr('class') and 
                                 any('product' in c.lower() or 'gallery' in c.lower() or 'post' in c.lower() or 'item' in c.lower() for c in tag['class']))
    
    if not contenedores:
        contenedores = soup.find_all('figure')

    for i, contenedor in enumerate(contenedores):
        # 1. Obtener enlace de detalle
        enlace = contenedor.find('a', href=True)
        if not enlace:
            continue
        url_detalle = urljoin(url_base, enlace['href'])
        
        if url_detalle in enlaces_procesados:
            continue
        enlaces_procesados.add(url_detalle)
        
        # 2. Obtener título
        heading = contenedor.find(['h2', 'h3', 'h4'])
        if heading:
            titulo = heading.get_text(strip=True)
        else:
            texto_crudo = contenedor.get_text(separator="\n", strip=True).split('\n')
            titulo = texto_crudo[0] if texto_crudo else f"Cuadro_{i+1}"
            
        nombre_carpeta = limpiar_nombre(titulo) or f"Cuadro_{i+1}"
        
        # 3. Obtener URL de la portada
        img_tag = contenedor.find('img')
        url_portada = None
        if img_tag:
            src_portada = img_tag.get('data-src') or img_tag.get('data-lazy-src') or img_tag.get('src')
            if src_portada:
                url_portada = urljoin(url_base, src_portada)

        print(f"\n[{i+1}] Procesando: {titulo}")
        
        # --- CREACIÓN DE CARPETAS ---
        ruta_carpeta_cuadro = os.path.join(CARPETA_PRINCIPAL, nombre_carpeta)
        ruta_subcarpeta_detalles = os.path.join(ruta_carpeta_cuadro, "Detalles")
        
        os.makedirs(ruta_carpeta_cuadro, exist_ok=True)
        os.makedirs(ruta_subcarpeta_detalles, exist_ok=True)
        
        # --- DESCARGAR PORTADA ---
        if url_portada:
            ext_portada = url_portada.split('.')[-1].split('?')[0]
            if ext_portada.lower() not in ['jpg', 'jpeg', 'png', 'webp']:
                ext_portada = 'jpg'
            ruta_portada = os.path.join(ruta_carpeta_cuadro, f"portada.{ext_portada}")
            print("   -> Descargando portada...")
            descargar_imagen(url_portada, ruta_portada)

        # --- PROCESAR DETALLES (Clic interior) ---
        print("   -> Entrando a descargar imágenes detalladas...")
        texto_descripcion = procesar_pagina_detalle(url_detalle, ruta_subcarpeta_detalles)
        
        # --- GUARDAR TEXTO EN LA CARPETA PRINCIPAL DEL CUADRO ---
        if texto_descripcion:
            ruta_texto = os.path.join(ruta_carpeta_cuadro, "descripcion.txt")
            with open(ruta_texto, 'w', encoding='utf-8') as f:
                f.write(f"Título: {titulo}\n")
                f.write(f"URL de origen: {url_detalle}\n")
                f.write("-" * 30 + "\n")
                f.write(texto_descripcion)

    print("\n¡Proceso finalizado con éxito! Revisa tu carpeta:", CARPETA_PRINCIPAL)

if __name__ == '__main__':
    extraer_galeria(URL_BASE)