import { getAllDeposits } from "@/apis/deposit";
import DepositForm from "@/components/DepositForm";
import Table from "@/components/Table";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const Task = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  const {
    data: DepositProductData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["getAllDeposits"],
    queryFn: getAllDeposits
  });

  return (
    <>
      <div style={{ width: "850px", height: "410px" }}>
        {selectedProduct && DepositProductData ? (
          <DepositForm product={selectedProduct} onBack={handleBack} />
        ) : (
          <Table
            products={DepositProductData?.data}
            onProductClick={handleProductClick}
          />
        )}
      </div>
    </>
  );
};

export default Task;
