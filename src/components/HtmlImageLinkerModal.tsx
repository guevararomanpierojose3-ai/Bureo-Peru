import { useState } from 'react';
import { X, Image as ImageIcon, Code, ExternalLink, Check, Copy, AlertCircle, Sparkles } from 'lucide-react';

interface HtmlImageLinkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvidenceImage?: (imgUrl: string, title: string) => void;
}

export default function HtmlImageLinkerModal({ isOpen, onClose, onAddEvidenceImage }: HtmlImageLinkerModalProps) {
  const [activeMode, setActiveMode] = useState<'tutorial' | 'tester' | 'snippets'>('tutorial');
  const [testUrl, setTestUrl] = useState('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80');
  const [testAlt, setTestAlt] = useState('Inspección de calidad en laboratorio industrial Bureo');
  const [testWidth, setTestWidth] = useState('100%');
  const [testLoading, setTestLoading] = useState<'lazy' | 'eager'>('lazy');
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const generatedHtml = `<img 
  src="${testUrl}" 
  alt="${testAlt}" 
  loading="${testLoading}"
  referrerpolicy="no-referrer"
  style="max-width: ${testWidth}; height: auto; border-radius: 6px;"
/>`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        id="html-image-linker-modal" 
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-lg shadow-2xl overflow-hidden my-6 text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-md text-white">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Vinculación de Imágenes desde HTML</h2>
              <p className="text-xs text-slate-300 font-mono">Guía de sintaxis, métodos de carga y probador interactivo</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
          <button
            onClick={() => setActiveMode('tutorial')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeMode === 'tutorial'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Formas de Vincular en HTML
          </button>
          <button
            onClick={() => setActiveMode('tester')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeMode === 'tester'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Probador en Vivo & Generador
          </button>
          <button
            onClick={() => setActiveMode('snippets')}
            className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeMode === 'snippets'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Plantillas Listas para Copiar
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {activeMode === 'tutorial' && (
            <div className="space-y-6 text-sm">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-900">
                <p className="font-semibold text-base mb-1">¡Sí, por supuesto! Puedes vincular cualquier imagen desde HTML.</p>
                <p className="text-xs text-blue-700">
                  En HTML y aplicaciones web se utiliza la etiqueta <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">&lt;img&gt;</code> junto con su atributo <code className="bg-blue-100 px-1 py-0.5 rounded font-mono font-bold">src</code> (source). Existen 4 métodos principales según el origen del archivo:
                </p>
              </div>

              {/* Method 1 */}
              <div className="border border-slate-200 rounded-md p-4 bg-white hover:border-slate-300 transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Método A • Ruta Local / Proyecto (Carpeta public)
                  </span>
                  <button 
                    onClick={() => copyToClipboard('<img src="/assets/bureo-logo.svg" alt="Logo Bureo" />', 'mA')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copied === 'mA' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'mA' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Coloca tu imagen dentro de la carpeta <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">public/assets/</code> y enlácela con una ruta absoluta relativa a la raíz:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
                  <code>{`<img src="/assets/bureo-logo.svg" alt="Logotipo Bureo Perú" width="180" />`}</code>
                </div>
              </div>

              {/* Method 2 */}
              <div className="border border-slate-200 rounded-md p-4 bg-white hover:border-slate-300 transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                    Método B • Enlace Externo por URL (HTTPS / CDN)
                  </span>
                  <button 
                    onClick={() => copyToClipboard('<img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Inspección" referrerpolicy="no-referrer" />', 'mB')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copied === 'mB' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'mB' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Vincular directamente cualquier imagen alojada en un servidor web o CDN seguro:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
                  <code>{`<img \n  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" \n  alt="Operaciones de Control de Calidad" \n  referrerpolicy="no-referrer" \n  loading="lazy"\n/>`}</code>
                </div>
              </div>

              {/* Method 3 */}
              <div className="border border-slate-200 rounded-md p-4 bg-white hover:border-slate-300 transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                    Método C • Gráficos Vectoriales SVG Incrustados
                  </span>
                  <button 
                    onClick={() => copyToClipboard('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#2563EB" /></svg>', 'mC')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {copied === 'mC' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'mC' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  No pierden calidad al hacer zoom y se pueden estilizar dinámicamente con CSS y Tailwind:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
                  <code>{`<svg viewBox="0 0 100 100" class="w-12 h-12 text-blue-600">\n  <circle cx="50" cy="50" r="40" fill="currentColor" />\n</svg>`}</code>
                </div>
              </div>

              {/* Method 4 */}
              <div className="border border-slate-200 rounded-md p-4 bg-white hover:border-slate-300 transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800">
                    Método D • Data URI en Base64 (Imágenes Autónomas)
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-2">
                  Incrusta los bytes de la imagen directamente en el código sin requerir un archivo externo:
                </p>
                <div className="bg-slate-900 text-slate-200 p-3 rounded font-mono text-xs overflow-x-auto">
                  <code>{`<img src="data:image/svg+xml;utf8,<svg ...>...</svg>" alt="Icono autónomo" />`}</code>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'tester' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      URL de la Imagen (src)
                    </label>
                    <input 
                      type="text" 
                      value={testUrl} 
                      onChange={(e) => setTestUrl(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                      placeholder="https://... o /assets/..."
                    />
                    {/* Fast presets */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button 
                        type="button"
                        onClick={() => setTestUrl('/assets/bureo-logo.svg')}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                      >
                        Logo Bureo (.svg)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTestUrl('/assets/bureo-badge.svg')}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                      >
                        Insignia ISO (.svg)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTestUrl('/assets/inspeccion-linea2.svg')}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                      >
                        Sala Limpia (.svg)
                      </button>
                      <button 
                        type="button"
                        onClick={() => setTestUrl('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80')}
                        className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 rounded text-slate-700"
                      >
                        Laboratorio (Web)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Texto Alternativo (alt)
                    </label>
                    <input 
                      type="text" 
                      value={testAlt} 
                      onChange={(e) => setTestAlt(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded focus:border-blue-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Ancho Máximo
                      </label>
                      <select 
                        value={testWidth}
                        onChange={(e) => setTestWidth(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-slate-300 rounded"
                      >
                        <option value="100%">100% (Fluido)</option>
                        <option value="300px">300 px</option>
                        <option value="200px">200 px</option>
                        <option value="120px">120 px</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Carga (loading)
                      </label>
                      <select 
                        value={testLoading}
                        onChange={(e) => setTestLoading(e.target.value as 'lazy' | 'eager')}
                        className="w-full px-2 py-2 text-xs border border-slate-300 rounded"
                      >
                        <option value="lazy">lazy (Diferida)</option>
                        <option value="eager">eager (Inmediata)</option>
                      </select>
                    </div>
                  </div>

                  {onAddEvidenceImage && (
                    <button
                      onClick={() => {
                        onAddEvidenceImage(testUrl, testAlt);
                        onClose();
                      }}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Vincular a Evidencias de CAPA
                    </button>
                  )}
                </div>

                {/* Live Preview Box */}
                <div className="flex flex-col border border-slate-300 rounded-md p-4 bg-slate-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Previsualización en Vivo HTML</span>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Enlazado Activo
                    </span>
                  </div>
                  <div className="flex-1 min-h-[180px] bg-white border border-slate-200 rounded flex items-center justify-center p-3 overflow-hidden">
                    <img 
                      src={testUrl} 
                      alt={testAlt}
                      loading={testLoading}
                      referrerPolicy="no-referrer"
                      className="max-h-[220px] object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLElement).setAttribute('src', '/assets/inspeccion-linea2.svg');
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Code output */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Código HTML Generado
                  </label>
                  <button 
                    onClick={() => copyToClipboard(generatedHtml, 'genHtml')}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                  >
                    {copied === 'genHtml' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'genHtml' ? '¡Copiado al Portapapeles!' : 'Copiar Código HTML'}
                  </button>
                </div>
                <div className="bg-slate-900 text-slate-100 p-3 rounded font-mono text-xs overflow-x-auto border border-slate-800">
                  <pre>{generatedHtml}</pre>
                </div>
              </div>
            </div>
          )}

          {activeMode === 'snippets' && (
            <div className="space-y-4 text-xs">
              <div className="border border-slate-200 rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">1. Imagen con pie de foto (&lt;figure&gt; y &lt;figcaption&gt;)</span>
                  <button 
                    onClick={() => copyToClipboard(`<figure>\n  <img src="/assets/foto-banda.svg" alt="Inspección Banda" />\n  <figcaption>Evidencia #01: Área de corte industrial</figcaption>\n</figure>`, 's1')}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copied === 's1' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`<figure>
  <img src="/assets/foto-banda.svg" alt="Inspección Banda" />
  <figcaption>Evidencia #01: Área de corte industrial</figcaption>
</figure>`}
                </pre>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">2. Imagen como enlace interactivo (&lt;a&gt; envolviendo &lt;img&gt;)</span>
                  <button 
                    onClick={() => copyToClipboard(`<a href="/assets/tara-calibrada.svg" target="_blank" rel="noopener noreferrer">\n  <img src="/assets/tara-calibrada.svg" alt="Certificado Balanza" />\n</a>`, 's2')}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copied === 's2' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`<a href="/assets/tara-calibrada.svg" target="_blank" rel="noopener noreferrer">
  <img src="/assets/tara-calibrada.svg" alt="Certificado Balanza" />
</a>`}
                </pre>
              </div>

              <div className="border border-slate-200 rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800">3. Elemento &lt;picture&gt; responsivo (WebP con fallback PNG)</span>
                  <button 
                    onClick={() => copyToClipboard(`<picture>\n  <source srcset="/assets/foto-01.webp" type="image/webp">\n  <img src="/assets/foto-01.png" alt="Evidencia digital" loading="lazy">\n</picture>`, 's3')}
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {copied === 's3' ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded font-mono text-[11px] overflow-x-auto">
{`<picture>
  <source srcset="/assets/foto-01.webp" type="image/webp">
  <img src="/assets/foto-01.png" alt="Evidencia digital" loading="lazy">
</picture>`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-mono">Bureo Perú • Especificación HTML5 W3C & ISO 9001</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 transition-colors"
          >
            Entendido / Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
