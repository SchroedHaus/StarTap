import { useState } from 'react'
import Signup from './components/Signup'
import Signin from './components/Signin'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {<Signin />}
    </>
  )
}

export default App
