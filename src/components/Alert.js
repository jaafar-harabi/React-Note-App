import React from 'react'

const Alert = (props) => {
  return (
    <div className='alert-container'>
    {props.validationMessages.map((message,index)=>
      <li  key={index}> {message} </li>
    )}
    </div>
  )
}

export default Alert