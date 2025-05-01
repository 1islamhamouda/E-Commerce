import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link } from "react-router-dom"


const Brands = () => {
 
  const getBrands = () => {
    return axios.get('https://ecommerce.routemisr.com/api/v1/brands')
  }
  const { data, error, isError, isFetched, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: getBrands,
  })

  if (isLoading) return <div className="flex justify-center items-center w-full h-screen">Loading...</div>
  if (isError) {
    console.log('error')
    console.log(error)
  }
  if (isFetched) {
    console.log('Fetched')
  }
  console.log(data?.data?.data._id);
 
  return (
    <>
      <h1 className="text-3xl font-bold">Brands</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-3">
        {data?.data?.data?.map((brand: any) => (
          <Link to={`/BrandDetails/${brand._id}`} className="" key={brand._id}>
            <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-3">
              <img src={brand.image} alt={brand.name} className="w-full" />
              <h3 className="text-lg font-semibold text-center">
                {brand.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </>
    
  )
}

export default Brands