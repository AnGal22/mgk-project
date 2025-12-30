import React from 'react'

type ProductProps = {
  name: string;
  info: string;
  image: string;
};

const Product = ({name, info, image}:ProductProps) => { //striktno definiranje tipova
  return (
    <div className='bg-gray-50 p-5 rounded-2xl shadow-inner shadow-blue-500 max-h-fit'>
      <img src={image} alt="product" className='max-w-50 border-4'/>
      <h1>{name}</h1>
      <p>{info}</p>
    </div>
  )
}

export default Product