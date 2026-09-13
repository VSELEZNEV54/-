import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LeadProvider } from './shared/LeadContext'
import { ConceptSelector } from './selector/ConceptSelector'
import { Concept1Layout } from './concept1/Layout'
import { Concept2Layout } from './concept2/Layout'
import { DocumentsPage } from './shared/DocumentsPage'
import { NotFound } from './shared/NotFound'
import { C1Home } from './concept1/pages/Home'
import { C1About } from './concept1/pages/About'
import { C1Contact } from './concept1/pages/Contact'
import { C1Blog } from './concept1/pages/Blog'
import { C1Article } from './concept1/pages/Article'
import { C2Home } from './concept2/pages/Home'
import { C2Cars } from './concept2/pages/Cars'
import { C2CarPage } from './concept2/pages/CarPage'
import { C2Tariffs } from './concept2/pages/Tariffs'
import { C2TariffPage } from './concept2/pages/TariffPage'
import { C2RentalTerms } from './concept2/pages/RentalTerms'
import { C2Offers } from './concept2/pages/Offers'
import { C2OfferPage } from './concept2/pages/OfferPage'
import { C2About } from './concept2/pages/About'
import { C2Reviews } from './concept2/pages/Reviews'
import { C2Faq } from './concept2/pages/Faq'
import { C2Blog } from './concept2/pages/Blog'
import { C2Article } from './concept2/pages/Article'
import { C2Contact } from './concept2/pages/Contact'
import { C2Compare } from './concept2/pages/Compare'

export default function App() {
  return (
    <BrowserRouter>
      <LeadProvider>
        <Routes>
          <Route path="/" element={<ConceptSelector />} />

          <Route path="/concept-1" element={<Concept1Layout />}>
            <Route index element={<C1Home />} />
            <Route path="about" element={<C1About />} />
            <Route path="contact" element={<C1Contact />} />
            <Route path="blog" element={<C1Blog />} />
            <Route path="blog/:slug" element={<C1Article />} />
            <Route path="documents" element={<DocumentsPage base="/concept-1" />} />
            <Route path="*" element={<NotFound base="/concept-1" />} />
          </Route>

          <Route path="/concept-2" element={<Concept2Layout />}>
            <Route index element={<C2Home />} />
            <Route path="cars" element={<C2Cars />} />
            <Route path="cars/:slug" element={<C2CarPage />} />
            <Route path="tariffs" element={<C2Tariffs />} />
            <Route path="tariffs/:slug" element={<C2TariffPage />} />
            <Route path="rental-terms" element={<C2RentalTerms />} />
            <Route path="offers" element={<C2Offers />} />
            <Route path="offers/:slug" element={<C2OfferPage />} />
            <Route path="about" element={<C2About />} />
            <Route path="reviews" element={<C2Reviews />} />
            <Route path="faq" element={<C2Faq />} />
            <Route path="blog" element={<C2Blog />} />
            <Route path="blog/:slug" element={<C2Article />} />
            <Route path="contact" element={<C2Contact />} />
            <Route path="compare" element={<C2Compare />} />
            <Route path="documents" element={<DocumentsPage base="/concept-2" />} />
            <Route path="*" element={<NotFound base="/concept-2" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LeadProvider>
    </BrowserRouter>
  )
}
