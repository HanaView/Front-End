import { getAllCards } from "@/apis/card";
import CardForm from "@/components/Form/CardForm";
import CardTable from "@/components/Table/CardTable";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";

const CardTask = () => {
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
    queryKey: ["getAllCards"],
    queryFn: getAllCards
  });

  return (
    <>
      <div style={{ width: "850px", height: "410px" }}>
        {selectedProduct && DepositProductData ? (
          <CardForm product={selectedProduct} onBack={handleBack} />
        ) : (
          <CardTable
            products={DepositProductData?.data}
            onProductClick={handleProductClick}
          />
        )}
      </div>
    </>
  );
};

export default CardTask;
