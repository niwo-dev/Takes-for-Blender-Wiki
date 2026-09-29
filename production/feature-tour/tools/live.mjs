// npm run live: serves the project and prints the address of the live, playable animation (no sound).
import { serve } from '../serve.mjs';
const { url } = await serve(+(process.env.PORT || 8765));
console.log(`Live preview: ${url}index.html   (Ctrl+C to stop)`);
