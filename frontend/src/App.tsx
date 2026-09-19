import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import './App.css'
import 'leaflet/dist/leaflet.css'
import { HomePage } from './pages/HomePage'

function App() {
  const { i18n, t } = useTranslation()

  useEffect(() => {
    const language = i18n.resolvedLanguage ?? 'en'

    document.documentElement.lang = language
    document.body.lang = language
    document.body.setAttribute('data-language', language)
    document.title = t('common.pageTitle')

    let descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]')

    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta')
      descriptionMeta.setAttribute('name', 'description')
      document.head.appendChild(descriptionMeta)
    }

    descriptionMeta.setAttribute('content', t('common.pageDescription'))
  }, [i18n, t])

  return (
    <div className="container mx-auto px-8 py-8" lang={i18n.resolvedLanguage ?? 'en'}>
      <main aria-label={t('common.mainContentLabel')}>
        <HomePage />
      </main>
    </div>
  )
}

export default App
