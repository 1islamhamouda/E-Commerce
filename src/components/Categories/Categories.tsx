import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Categories = () => {
  const getCategories = () => {
    return axios.get('https://ecommerce.routemisr.com/api/v1/categories');
  }
  const {data}=useQuery({
    queryKey: ['categoriess'],
    queryFn: getCategories,
  })
  let categories = data?.data?.data;
  if(!categories) return <div className="flex justify-center items-center w-full h-screen">Loading...</div>
  return (
   
    <>
     <div className="bg-gray-100 min-h-screen p-4">
     <h1 className="text-3xl font-bold">Categories</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-3 rounded-lg p-3 ">
        {categories?.map((category: any) => (
          <div className="flex flex-col items-center bg-gray-200 shadow-lg rounded-lg p-3" key={category._id}>
            <img src={category.image} alt={category.name} className="w-full h-52 rounded-full " />
            <h3 className="text-lg font-semibold text-center text-amber-900 font-serif">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
     </div>
    </>
  )
}

export default Categories
