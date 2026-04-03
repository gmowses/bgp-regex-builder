import { useState, useEffect } from 'react'
import { Sun, Moon, Languages, Code2, Copy, Trash2, CheckCircle2 } from 'lucide-react'

const translations = {
  en: {
    title: 'BGP AS_PATH Regex Builder',
    subtitle: 'Visually build AS_PATH regular expressions and export ready-to-use configurations for Cisco, Juniper, and MikroTik.',
    builder: 'Pattern Builder',
    preview: 'Regex Preview',
    testInput: 'Test AS_PATH (space-separated ASNs)',
    testResult: 'Test Result',
    matches: 'Matches',
    noMatch: 'No match',
    emptyRegex: 'Build a pattern above',
    output: 'Vendor Output',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    buttons: {
      anyAs: 'Any AS (.)',
      oneOrMore: 'One or more (.+)',
      zeroOrMore: 'Zero or more (.*)',
      specificAs: 'Specific AS',
      asSet: 'AS set ([ ])',
      negate: 'Negate ([^ ])',
      anchorStart: 'Start (^)',
      anchorEnd: 'End ($)',
      group: 'Group (  )',
      or: 'OR ( | )',
      optional: 'Optional (?)',
    },
    enterAs: 'ASN (e.g. 65000)',
    enterRange: 'ASN range (e.g. 65000-65100)',
    insert: 'Insert',
    cancel: 'Cancel',
    examplePatterns: 'Example Patterns',
    examples: [
      { label: 'Originated by AS65000', regex: '^65000$' },
      { label: 'Transiting AS174', regex: '_174_' },
      { label: 'From any customer (1 hop)', regex: '^[0-9]+$' },
      { label: 'Prepended AS65000 x3', regex: '^65000 65000 65000 ' },
      { label: 'Any path length', regex: '.*' },
    ],
    builtBy: 'Built by',
    references: 'References',
    refList: ['RFC 4271 – BGP-4', 'Cisco IOS: ip as-path access-list', 'Juniper: policy-options as-path'],
  },
  pt: {
    title: 'Construtor de Regex AS_PATH BGP',
    subtitle: 'Construa expressoes regulares de AS_PATH visualmente e exporte configuracoes prontas para Cisco, Juniper e MikroTik.',
    builder: 'Construtor de Padrao',
    preview: 'Previa do Regex',
    testInput: 'Testar AS_PATH (ASNs separados por espaco)',
    testResult: 'Resultado do Teste',
    matches: 'Corresponde',
    noMatch: 'Sem correspondencia',
    emptyRegex: 'Construa um padrao acima',
    output: 'Saida por Fornecedor',
    copy: 'Copiar',
    copied: 'Copiado!',
    clear: 'Limpar',
    buttons: {
      anyAs: 'Qualquer AS (.)',
      oneOrMore: 'Um ou mais (.+)',
      zeroOrMore: 'Zero ou mais (.*)',
      specificAs: 'AS especifico',
      asSet: 'Conjunto AS ([ ])',
      negate: 'Negar ([^ ])',
      anchorStart: 'Inicio (^)',
      anchorEnd: 'Fim ($)',
      group: 'Grupo (  )',
      or: 'OU ( | )',
      optional: 'Opcional (?)',
    },
    enterAs: 'ASN (ex: 65000)',
    enterRange: 'Faixa ASN (ex: 65000-65100)',
    insert: 'Inserir',
    cancel: 'Cancelar',
    examplePatterns: 'Padroes de Exemplo',
    examples: [
      { label: 'Originado pelo AS65000', regex: '^65000$' },
      { label: 'Transitando pelo AS174', regex: '_174_' },
      { label: 'De qualquer cliente (1 salto)', regex: '^[0-9]+$' },
      { label: 'AS65000 com prepend x3', regex: '^65000 65000 65000 ' },
      { label: 'Qualquer tamanho de caminho', regex: '.*' },
    ],
    builtBy: 'Criado por',
    references: 'Referencias',
    refList: ['RFC 4271 – BGP-4', 'Cisco IOS: ip as-path access-list', 'Juniper: policy-options as-path'],
  },
} as const

type Lang = keyof typeof translations

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildVendorOutput(regex: string) {
  return {
    cisco: `ip as-path access-list 1 permit ${regex}`,
    juniper: `policy-options {\n  as-path MY_PATH "${regex}";\n}`,
    mikrotik: `/routing filter rule add chain=bgp-in rule="if (bgp-path ~ \\"${regex}\\") { accept }"`,
  }
}

export default function BgpRegexBuilder() {
  const [lang, setLang] = useState<Lang>(() => (navigator.language.startsWith('pt') ? 'pt' : 'en'))
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [regex, setRegex] = useState('')
  const [testInput, setTestInput] = useState('65000 174 3356 13335')
  const [copiedKey, setCopiedKey] = useState('')
  const [showAsInput, setShowAsInput] = useState(false)
  const [asValue, setAsValue] = useState('')

  const t = translations[lang]
  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  const append = (s: string) => setRegex(r => r + s)

  const testMatch = () => {
    if (!regex) return null
    try {
      const re = new RegExp(regex)
      return re.test(testInput)
    } catch {
      return null
    }
  }

  const matchResult = testMatch()
  const vendor = buildVendorOutput(regex)

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(''), 2000)
    })
  }

  const btnClass = 'px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-semibold">BGP Regex Builder</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />{lang.toUpperCase()}
            </button>
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/bgp-regex-builder" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
            <h2 className="font-semibold">{t.builder}</h2>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => append('^')} className={btnClass}>{t.buttons.anchorStart}</button>
              <button onClick={() => append('$')} className={btnClass}>{t.buttons.anchorEnd}</button>
              <button onClick={() => append('.')} className={btnClass}>{t.buttons.anyAs}</button>
              <button onClick={() => append('.+')} className={btnClass}>{t.buttons.oneOrMore}</button>
              <button onClick={() => append('.*')} className={btnClass}>{t.buttons.zeroOrMore}</button>
              <button onClick={() => append('?')} className={btnClass}>{t.buttons.optional}</button>
              <button onClick={() => append('()')} className={btnClass}>{t.buttons.group}</button>
              <button onClick={() => append('|')} className={btnClass}>{t.buttons.or}</button>
              <button onClick={() => append('[0-9]+')} className={btnClass}>{t.buttons.asSet}</button>
              <button onClick={() => append('[^0-9]')} className={btnClass}>{t.buttons.negate}</button>
              <button onClick={() => append(' ')} className={btnClass}>Space</button>
              <button onClick={() => append('_')} className={btnClass}>_ (boundary)</button>
              <button onClick={() => setShowAsInput(v => !v)} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors">{t.buttons.specificAs}</button>
            </div>

            {showAsInput && (
              <div className="flex gap-2 items-center">
                <input value={asValue} onChange={e => setAsValue(e.target.value)} placeholder={t.enterAs}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 w-48" />
                <button onClick={() => { append(escapeRegex(asValue)); setAsValue(''); setShowAsInput(false) }}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors">{t.insert}</button>
                <button onClick={() => setShowAsInput(false)} className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">{t.cancel}</button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">{t.preview}</label>
                <div className="flex gap-2">
                  <button onClick={() => copy(regex, 'regex')} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-500 transition-colors">
                    {copiedKey === 'regex' ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                    {copiedKey === 'regex' ? t.copied : t.copy}
                  </button>
                  <button onClick={() => setRegex('')} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-500 transition-colors">
                    <Trash2 size={12} />{t.clear}
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 px-4 py-3 font-mono text-sm text-blue-700 dark:text-blue-300 min-h-[44px]">
                {regex || <span className="text-zinc-400 italic text-xs">{t.emptyRegex}</span>}
              </div>
              <input value={regex} onChange={e => setRegex(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Edit regex directly..." />
            </div>
          </div>

          {/* Test */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
            <h2 className="font-semibold">{t.testInput}</h2>
            <input value={testInput} onChange={e => setTestInput(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {regex && (
              <div className={`rounded-lg px-4 py-3 text-sm font-medium flex items-center gap-2 ${matchResult === true ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : matchResult === false ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'}`}>
                {matchResult === true && <CheckCircle2 size={16} />}
                {matchResult === true ? t.matches : matchResult === false ? t.noMatch : 'Invalid regex'}
              </div>
            )}
          </div>

          {/* Example patterns */}
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
            <h2 className="font-semibold">{t.examplePatterns}</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {t.examples.map(ex => (
                <button key={ex.label} onClick={() => setRegex(ex.regex)}
                  className="text-left rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                  <p className="text-xs text-zinc-500 mb-1">{ex.label}</p>
                  <p className="font-mono text-sm text-blue-600 dark:text-blue-400">{ex.regex}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vendor output */}
          {regex && (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <h2 className="font-semibold">{t.output}</h2>
              {([
                { key: 'cisco', label: 'Cisco IOS', color: '#3b82f6', code: vendor.cisco },
                { key: 'juniper', label: 'Juniper JunOS', color: '#ef4444', code: vendor.juniper },
                { key: 'mikrotik', label: 'MikroTik RouterOS', color: '#f59e0b', code: vendor.mikrotik },
              ] as const).map(v => (
                <div key={v.key} className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800">
                    <span className="text-xs font-semibold" style={{ color: v.color }}>{v.label}</span>
                    <button onClick={() => copy(v.code, v.key)} className="flex items-center gap-1 text-xs text-zinc-500 hover:text-blue-500 transition-colors">
                      {copiedKey === v.key ? <CheckCircle2 size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copiedKey === v.key ? t.copied : t.copy}
                    </button>
                  </div>
                  <pre className="px-4 py-3 text-xs font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap break-all">{v.code}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-blue-500 transition-colors">Gabriel Mowses</a></span>
            <span>MIT License</span>
          </div>
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <p className="text-xs font-medium text-zinc-500 mb-1">{t.references}</p>
            <ul className="space-y-0.5">
              {t.refList.map(ref => <li key={ref} className="text-xs text-zinc-400">{ref}</li>)}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
