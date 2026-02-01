import { createRoot } from 'react-dom/client'
import './index.css'
import Routers from './router/Routers'

import { DataProvider } from './context/DataContext'
import { LoaderProvider } from './context/LoaderContext'

createRoot(document.getElementById('root')).render(
    <DataProvider>
        <LoaderProvider>
            <Routers /> 
        </LoaderProvider>
    </DataProvider>
)
