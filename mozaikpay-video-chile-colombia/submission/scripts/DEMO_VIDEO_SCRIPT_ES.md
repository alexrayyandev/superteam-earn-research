# Guion de Demostracion en Video: Integracion MozaikPay (Chile y Colombia)
## Demostracion de Pagos Transfronterizos y Liquidacion Instantanea en Solana USDC

**Autor**: Alex Rayyan (Lead Systems Architect & Security Researcher)  
**Contacto**: bansoslab2026@tutamail.com  
**Billetera de Pago (Solana)**: 39YTqgacjKt1iz22SrvX4G3Ds8TUUjd9hWPPSJpdd2jZ  
**Billetera de Pago (Base EVM)**: 0xf71e0734cb53162e8c9baaf5f49841a51c945899  

---

### Sinopsis Ejecutiva
Este guion tecnico esta disenado para un video tutorial de 5 minutos dirigido a ingenieros de software, comercios y directores de tecnologia en Chile y Colombia. Demuestra como MozaikPay elimina las barreras bancarias tradicionales permitiendo cobrar en monedas locales (Pesos Chilenos via WebPay/Khipu y Pesos Colombianos via PSE/Nequi) y recibir liquidacion instantanea en USDC en la red Solana.

---

### Tabla de Produccion Audiovisual (Acto 1 al Acto 5)

| Tiempo | Indicacion Visual | Audio y Locucion (Espanol Neutro LATAM) | Texto en Pantalla |
|---|---|---|---|
| **0:00 - 0:25** | Plano principal del presentador con fondo sobrio y grafico animado de LATAM con lineas de pago rotas. | El comercio transfronterizo en Latinoamerica sigue atrapado en sistemas lentos. Cobrar a un cliente en Chile o Colombia y recibir los fondos toma de tres a cinco dias habiles, con comisiones bancarias abusivas y cero trazabilidad. | **El Problema**: Pagos Lentos y Costosos en LATAM |
| **0:25 - 0:50** | Animacion de la arquitectura de MozaikPay conectando WebPay, PSE y la red Solana. | MozaikPay resuelve este cuello de botella con una arquitectura unificada. Permite que tus clientes paguen con sus metodos locales favoritos, mientras tu empresa liquida los fondos de forma atomica en USDC sobre Solana. | **MozaikPay**: Pagos Locales -> Liquidacion en USDC |
| **0:50 - 1:15** | Captura de pantalla del dashboard de MozaikPay navegando por la seccion de API Keys y Webhooks. | En este video veremos como integrar el SDK en TypeScript, configurar webhooks con firma criptografica HMAC y verificar una transaccion real en vivo. | **Tutorial Tecnico**: De Cero a Produccion en 5 Minutos |
| **1:15 - 1:45** | Visualizacion de los rieles de pago activos en el panel: Chile (WebPay Plus, Khipu) y Colombia (PSE, Nequi, Bancolombia). | En el panel de control activamos los metodos por pais. En Chile soportamos WebPay y transferencias bancarias Khipu en CLP. En Colombia integramos PSE y Nequi en COP. Todo con una sola clave de autenticacion. | **Chile**: WebPay / Khipu (CLP)<br>**Colombia**: PSE / Nequi (COP) |
| **1:45 - 2:15** | Visual Studio Code mostrando el archivo de configuracion `.env` y la inicializacion del cliente MozaikPay. | Pasemos al codigo. Inicializamos la libreria definiendo nuestra API Key y los paises habilitados. El SDK abstrae completamente las complejidades de cambio de divisa y conexion bancaria. | `const mozaik = new MozaikPay({ apiKey, network: 'mainnet' });` |
| **2:15 - 2:45** | Codigo del endpoint de creacion de intencion de pago en Next.js / Express con parametros de moneda y monto. | Para iniciar un cobro creamos un `PaymentIntent`. Definimos el monto en moneda local —por ejemplo cincuenta mil pesos chilenos—, el correo del comprador y la direccion de destino en Solana. | `await mozaik.payments.create({ amount: 50000, currency: 'CLP' })` |
| **2:45 - 3:15** | Inspeccion del componente de checkout en React mostrando la seleccion de pasarela y redireccion segura. | En el frontend, el componente de checkout renderiza dinamicamente los metodos de pago segun el pais detectado, garantizando una experiencia de usuario limpia y con conversion optimizada. | **Frontend React**: Checkout Nativo y Responsivo |
| **3:15 - 3:45** | Codigo del webhook en Express con validacion de firma criptografica `x-mozaikpay-signature`. | La seguridad es fundamental. Nuestro servidor valida la firma HMAC-SHA256 en los headers para garantizar que el evento proviene legitimamente de MozaikPay y evitar ataques de repeticion. | `verifySignature(req.body, signature, webhookSecret)` |
| **3:45 - 4:15** | Demostracion en vivo: Pago simulado exitoso en WebPay y confirmacion de webhook en terminal. | Al completarse el pago, MozaikPay despacha el evento `payment.completed`. El despachador de liquidacion firma la transferencia automatica de USDC directamente hacia la tesoreria de la empresa. | **Evento**: `payment.completed` -> Liquidacion Disparada |
| **4:15 - 4:40** | Pantalla dividida: Notificacion de transaccion y explorador Solscan confirmando recepcion de USDC en segundos. | Aqui vemos la prueba en blockchain. En cuestion de cuatrocientos milisegundos, los USDC estan disponibles en la billetera corporativa de Solana con costo de transaccion inferior a un centavo de dolar. | **Confirmado en Solscan**: Finalizado en < 1 segundo |
| **4:40 - 5:00** | Primer plano del presentador con enlaces en pantalla a la documentacion y repositorio de GitHub. | Con MozaikPay abres el mercado de Chile y Colombia hoy mismo sin lidiar con burocracia bancaria. Todo el codigo y la documentacion tecnica estan disponibles en el repositorio adjunto. Comienza a integrar hoy. | **MozaikPay**: El Estandar de Pagos Web3 en LATAM<br>GitHub: `alexrayyan/mozaikpay-solana-harness` |

---

### Guia de Produccion y Activos Requeridos
1. **Resolucion**: 1080p a 60 fps con audio limpio (sin musica de fondo invasiva).
2. **Codigo Fuente**: Ubicado en `/home/bansos-lab/superteam_bounties/mozaikpay-video-chile-colombia/submission/code/mozaik_integration.ts`.
3. **Firmado**: Alex Rayyan (`bansoslab2026@tutamail.com`).
