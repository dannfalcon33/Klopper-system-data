# KLOPPER

**KLOPPER** es una terminal táctica de inteligencia de mercado cripto de grado profesional diseñada para el análisis on-chain en tiempo real, mapas de calor de liquidez, rastreo de grandes movimientos institucionales (ballenas) y análisis de mitigación asistido por Inteligencia Artificial.

---

## 🚀 ¿Cómo Funciona la Aplicación?

KLOPPER opera como una estación de comando táctica unificada que integra flujos de datos en tiempo real de múltiples redes de cadena de bloques y herramientas de modelado de mercado para brokers (CFDs como Exness). Su flujo de trabajo se divide en cuatro grandes pilares operativos:

### 1. Sistema de Control de Acceso Local (4 Capas de Seguridad)
Para proteger la terminal contra accesos no autorizados, KLOPPER implementa un flujo de autenticación local robusto y altamente inmersivo de cuatro capas:
*   **Capa 01 - Credenciales Maestras:** Validación de ID de Operador y clave de acceso directo (Por defecto, operador: `admin` / clave: `password`).
*   **Capa 02 - PIN Táctico:** Teclado numérico virtual dinámico cifrado donde se debe introducir un PIN numérico de 6 dígitos (Por defecto: `123456`).
*   **Capa 03 - Pregunta de Seguridad:** Un cuestionario aleatorio con respuestas seguras para validar la presencia humana (Por defecto, incluye opción de autocompletado inteligente).
*   **Capa 04 - Doble Factor OTP:** Sincronización en tiempo real con un simulador dinámico de Google Authenticator. Requiere ingresar el código de 6 dígitos que cambia automáticamente cada 30 segundos.

---

### 2. Radar de Ballenas On-Chain Inteligente
KLOPPER rastrea de forma continua transacciones de volumen crítico (superiores a $500,000 USD) en las redes principales: **Bitcoin (BTC)**, **Ethereum (ETH)**, **Solana (SOL)** y **BNB Chain (BNB)**.

*   **Enlaces On-Chain Directos:** Cada transacción cuenta con su hash (`txHash`) formateado como un enlace interactivo directo hacia su respectivo explorador oficial:
    *   **Solana (SOL):** Enlace directo a [Solscan](https://solscan.io).
    *   **Bitcoin (BTC):** Enlace directo a [Mempool.space](https://mempool.space).
    *   **Ethereum (ETH):** Enlace directo a [Etherscan](https://etherscan.io).
    *   **BNB Chain (BNB):** Enlace directo a [BscScan](https://bscscan.io).
*   **Alertas LED Dinámicas Visuales (Screen Flash):** Al registrarse o simularse un nuevo movimiento de gran escala, toda la pantalla parpadea con una luz LED de advertencia:
    *   🟢 **Luz Verde LED (Flash):** Se activa al detectar compras institucionales masivas (`ACCUMULATION`, `LIQUIDITY_ADD`, o transferencias directas hacia Cold Wallets).
    *   🔴 **Luz Roja LED (Flash):** Se activa al detectar ventas fuertes o descargas masivas (`DUMP`, `LIQUIDITY_REMOVE`, o transferencias hacia exchanges centralizados CEX).

---

### 3. Síntesis de Audio Táctico en Tiempo Real
La terminal cuenta con un motor de síntesis de audio basado en el estándar **Web Audio API** que genera señales acústicas e interacciones inmersivas de alta tecnología de forma nativa sin depender de archivos de audio pesados:
*   **Carga de Sensores y Datos:** Pitidos limpios y de frecuencia ascendente durante el inicio y finalización del escaneo de APIs de mercado.
*   **Procesamiento IA Activo:** Un murmullo/pulso rítmico de tono binario que suena de forma constante mientras el motor de Inteligencia Artificial computa las respuestas, brindando retroalimentación táctil de que la terminal está procesando.
*   **Alertas de Alarma:** Sirenas e hilos tonales diferenciados para compras y ventas críticas.

---

### 4. Consola y Central de Comando Asistida por IA (Gemini 3.5 Flash)
La terminal integra una central de comando en el frontend que se conecta de manera segura con el motor de IA server-side de Gemini.
*   **Análisis Predictivo:** Los operadores pueden solicitar evaluaciones detalladas sobre la acumulación de liquidez de las ballenas detectadas.
*   **Soporte de Capturas Exness:** Permite arrastrar o cargar capturas de pantalla de análisis técnicos de Exness para que la IA realice un diagnóstico inmediato de Order Blocks y zonas de mitigación de liquidez.
*   **Acciones Rápidas (Macros):** Accesos directos de un clic para inyectar consultas operativas preconfiguradas sobre tasas de interés abierto (OI), tasas de financiación (Funding Rates) y pools de liquidación.

---

## 🛠️ Stack Tecnológico

*   **Frontend:** React 19 con Next.js 15+ (App Router).
*   **Estilo:** Tailwind CSS para layouts de alta densidad táctica y diseño ultra-pulido.
*   **Animaciones:** `motion/react` (Framer Motion) para micro-transiciones fluidas y simulación del flash LED.
*   **Audio:** Web Audio API nativo (Oscillators/Gain nodes).
*   **Backend & APIs:** Next.js API Routes proxies para alimentar sensores on-chain y llamadas seguras de Gemini 3.5 Flash sin exponer claves de API en el cliente.
