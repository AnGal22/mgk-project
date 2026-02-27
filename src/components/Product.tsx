

type ProductProps = {
  name: { hr: string; en: string };
  info: { hr: string; en: string };
  image: string;
  lang: 'hr' | 'en';
};


const Product = ({name, info, image, lang}:ProductProps) => { //striktno definiranje tipova
  return (
    <div className='bg-gray-50 p-5 rounded-2xl shadow-inner shadow-blue-500 max-h-fit animate-appear'>
      <img src={image} alt="product" className='max-w-50 border-4'/>
      <h1>{name[lang]}</h1>
      <p>{info[lang]}</p>
    </div>
  )
}

export default Product
