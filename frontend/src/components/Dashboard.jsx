// src/components/Dashboard.js
import React from "react";

function Dashboard({ products }) {
  // Function to calculate total inventory value
  const calculateTotalInventoryValue = () => {
    return products.reduce(
      (total, product) => total + product.quantity * product.buyingPrice,
      0
    );
  };

  // Function to calculate total sales value (assuming all sales were at the selling price)
  // This needs to be adjusted based on actual sales data
  const calculateTotalSalesValue = () => {
    return products.reduce(
      (total, product) =>
        total + (product.quantity - product.quantity) * product.sellingPrice,
      0
    );
  };

  // Function to calculate total profit (assuming all sales were at the selling price)
  // This needs to be adjusted based on actual sales data
  const calculateTotalProfit = () => {
    return products.reduce(
      (total, product) =>
        total +
        (product.quantity - product.quantity) *
          (product.sellingPrice - product.buyingPrice),
      0
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Total Inventory Value
        </h3>
        <p className="text-2xl text-blue-500">
          ${calculateTotalInventoryValue().toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Total Sales Value
        </h3>
        <p className="text-2xl text-green-500">
          ${calculateTotalSalesValue().toFixed(2)}
        </p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Total Profit</h3>
        <p className="text-2xl text-green-500">
          ${calculateTotalProfit().toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default Dashboard;