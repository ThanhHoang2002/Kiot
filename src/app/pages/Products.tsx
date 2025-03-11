import ActionSection from '@/features/products/components/ActionSection'
import { ProductsTable } from '@/features/products/components/ProductsTable'
import { useProducts } from '@/features/products/hooks/useProducts'

const Products = () => {
  const {data,handlePageChange,handleSearch,handleSelectAll,handleToggleSelect,isLoading,limit,page,selectedProducts } =useProducts()
  return (
    <div className='space-y-8 p-2 pb-10'>
      <ActionSection handleSearch={handleSearch}/>
      <ProductsTable 
        data={data} 
        handlePageChange={handlePageChange}
        handleSelectAll={handleSelectAll}
        handleToggleSelect={handleToggleSelect}
        isLoading={isLoading}
        limit={limit}
        page={page}
        selectedProducts={selectedProducts}
      /> 
    </div>
  )
}

export default Products