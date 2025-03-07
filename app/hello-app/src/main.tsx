import React from 'react'
import ReactDom from 'react-dom/client'

ReactDom.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

function App() {
  return <div>hello, this is a react app</div>
}