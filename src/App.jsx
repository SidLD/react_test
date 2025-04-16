import React from 'react';
import './App.css';
import { AnimatePresence } from 'framer-motion'
import { Suspense } from "react"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Spinner from './components/Spinner/Spinner.jsx';
import { LunchPage } from './pages/lunches/index.jsx';

export default function App() {
  return (
    <AnimatePresence>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route index path='/'  element={<LunchPage/>}/>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AnimatePresence>
  )
}