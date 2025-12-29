import React from 'react'

type ProductProps = {
  name: string;
  info: string;
  image: string;
};

const Product = ({name, info, image}:ProductProps) => { //striktno definiranje tipova
  return (
    <div className='bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10 max-h-fit'>
      <img src={image} alt="product" className='max-w-50'/>
      <h1>{name}</h1>
      <p>{info}</p>
    </div>
  )
}

export default Product