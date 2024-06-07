import { getAllDeposits } from "@/apis/deposit";
import DepositForm from "@/components/Form/DepositForm";
import DepositTable from "@/components/Table/DepositTable";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const DepositTask = () => {
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
          <DepositTable
            products={DepositProductData?.data}
            onProductClick={handleProductClick}
          />
        )}
      </div>
    </>
  );
};

export default DepositTask;
