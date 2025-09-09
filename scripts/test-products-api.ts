async function testProductsAPI() {
  try {
    console.log('🧪 Testing products API...')
    
    const response = await fetch('http://localhost:3001/api/products')
    const data = await response.json()
    
    if (data.success && data.products.length > 0) {
      console.log(`✅ Found ${data.products.length} products`)
      
      const firstProduct = data.products[0]
      console.log('First product:', firstProduct.name)
      console.log('Has images:', firstProduct.images && firstProduct.images.length > 0)
      
      if (firstProduct.images && firstProduct.images.length > 0) {
        console.log('First image URL:', firstProduct.images[0].url)
      }
    } else {
      console.log('❌ No products found or API error')
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error)
  }
}

testProductsAPI()
  .then(() => {
    console.log('🎉 Test completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Test failed:', error)
    process.exit(1)
  })
