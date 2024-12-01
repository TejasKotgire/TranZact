import React, { useState, useMemo } from "react";
import { 
  Pencil, 
  Trash2, 
  ShoppingCart, 
  Search, 
  Package
} from 'lucide-react';

function App() {
  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "Laptop",
      description: "High-performance laptop with 16GB RAM and 1TB SSD",
      quantity: 10,
    },
    {
      _id: "2",
      name: "Keyboard",
      description: "Mechanical keyboard with RGB backlighting",
      quantity: 25,
    },
    {
      _id: "3",
      name: "Mouse",
      description: "Wireless gaming mouse with adjustable DPI",
      quantity: 15,
    },
  ]);

  const [sales, setSales] = useState([]);

  // Product Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");

  // New Sale States
  const [saleProducts, setSaleProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState(1);

  // Product Management Functions
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Update existing product
        setProducts(
          products.map((product) =>
            product._id === editingProduct._id
              ? {
                  ...product,
                  name,
                  description,
                  quantity: parseInt(quantity),
                }
              : product
          )
        );
        setEditingProduct(null);
      } else {
        // Add new product
        const newProduct = {
          _id: (Math.max(...products.map((p) => parseInt(p._id))) + 1).toString(),
          name,
          description,
          quantity: parseInt(quantity),
        };
        setProducts([...products, newProduct]);
      }
      clearForm();
    } catch (error) {
      console.error("Error adding/updating product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setQuantity(product.quantity);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product._id !== id));
    }
  };

  const clearForm = () => {
    setName("");
    setDescription("");
    setQuantity("");
  };

  // Sales Recording Functions
  const handleAddSaleProduct = () => {
    if (selectedProduct && saleQuantity > 0) {
      // Check if product is already in sale list
      const existingProductIndex = saleProducts.findIndex(
        (sp) => sp.product._id === selectedProduct._id
      );

      if (existingProductIndex !== -1) {
        // Update existing product in sale list
        const updatedSaleProducts = [...saleProducts];
        updatedSaleProducts[existingProductIndex].quantity += saleQuantity;
        setSaleProducts(updatedSaleProducts);
      } else {
        // Add new product to sale list
        setSaleProducts([
          ...saleProducts,
          { product: selectedProduct, quantity: saleQuantity },
        ]);
      }

      // Reset selection
      setSelectedProduct(null);
      setSaleQuantity(1);
      setSearchQuery("");
    }
  };

  const handleRecordSale = () => {
    if (saleProducts.length === 0) return;

    // Validate stock availability
    const insufficientStock = saleProducts.some(
      (sp) => sp.quantity > sp.product.quantity
    );

    if (insufficientStock) {
      alert("Insufficient stock for one or more products!");
      return;
    }

    // Record sale
    const newSale = {
      id: Date.now().toString(),
      products: saleProducts,
      date: new Date().toLocaleString(),
    };
    setSales([...sales, newSale]);

    // Update product quantities
    const updatedProducts = products.map((product) => {
      const saleProduct = saleProducts.find((sp) => sp.product._id === product._id);
      if (saleProduct) {
        return {
          ...product,
          quantity: product.quantity - saleProduct.quantity,
        };
      }
      return product;
    });
    setProducts(updatedProducts);

    // Clear sale products
    setSaleProducts([]);
  };

  // Remove product from sale
  const removeProductFromSale = (productId) => {
    setSaleProducts(
      saleProducts.filter((sp) => sp.product._id !== productId)
    );
  };

  // Filtering and Sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm)
        );
      })
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [products, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Package className="mr-3 h-8 w-8" />
            <h1 className="text-2xl font-bold">Inventory Management</h1>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Form */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              {editingProduct ? (
                <>
                  <Pencil className="mr-2 text-blue-600" /> Edit Product
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 text-green-600" /> Add Product
                </>
              )}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      clearForm();
                    }}
                    className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition duration-300"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Product List and Sales */}
          <div className="lg:col-span-2 space-y-6">
            {/* New Sale Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-green-600" /> Record New Sale
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Product Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Product
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={selectedProduct ? selectedProduct.name : searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSelectedProduct(null);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {searchQuery && !selectedProduct && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product._id}
                            onClick={() => {
                              setSelectedProduct(product);
                              setSearchQuery("");
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {product.name} (Stock: {product.quantity})
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={saleQuantity}
                    onChange={(e) => setSaleQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    max={selectedProduct ? selectedProduct.quantity : 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!selectedProduct}
                  />
                </div>

                {/* Add to Sale Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleAddSaleProduct}
                    disabled={!selectedProduct || saleQuantity < 1 || saleQuantity > (selectedProduct?.quantity || 0)}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300 disabled:opacity-50"
                  >
                    Add to Sale
                  </button>
                </div>
              </div>

              {/* Sale Products List */}
              {saleProducts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Sale Items</h3>
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-center">Quantity</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {saleProducts.map((saleProduct) => (
                        <tr key={saleProduct.product._id} className="border-b">
                          <td className="px-4 py-2">{saleProduct.product.name}</td>
                          <td className="px-4 py-2 text-center">{saleProduct.quantity}</td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => removeProductFromSale(saleProduct.product._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleRecordSale}
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                    >
                      Complete Sale
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <Package className="mr-2 text-blue-600" /> Product Inventory
                </h2>
                <div className="flex space-x-4">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Description</th>
                    <th className="py-3 px-4 text-center">Quantity</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr 
                      key={product._id} 
                      className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">{product.description}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.quantity <= 5 
                              ? 'bg-red-200 text-red-800' 
                              : product.quantity <= 10 
                                ? 'bg-yellow-200 text-yellow-800' 
                                : 'bg-green-200 text-green-800'
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Pencil className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No products found
                </div>
              )}
            </div>

            {/* Sales History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-green-600" /> Sales History
              </h2>
              {sales.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No sales recorded yet
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                        <th className="py-3 px-4 text-left">Sale ID</th>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Products</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sales.map((sale) => (
                        <tr 
                          key={sale.id} 
                          className="border-b border-gray-200 hover:bg-gray-50 transition duration-200"
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium">#{sale.id.slice(-6)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-600">{sale.date}</span>
                          </td>
                          <td className="py-3 px-4">
                            {sale.products.map((sp) => (
                              <div key={sp.product._id} className="flex justify-between">
                                <span>{sp.product.name}</span>
                                <span className="text-gray-500">x {sp.quantity}</span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;