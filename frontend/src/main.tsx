import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter} from 'react-router-dom'
import {AuthProvider} from './contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'react-toastify/dist/ReactToastify.css'
import {ToastContainer} from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App/>
                <ToastContainer position="top-right" autoClose={3000}/>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
