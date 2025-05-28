import React from 'react'

const Button = ({children, type, loading, onClick}) => {
  return (
    <button onClick={onClick} type={type} loading={loading} className='h-[59px] w-full mt-5'>
        {children}
    </button>
  )
}

export default Button