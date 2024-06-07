import { getAllSavings } from "@/apis/saving";
import SavingForm from "@/components/Form/SavingForm";
import SavingTable from "@/components/Table/SavingTable";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const SavingTask = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBack = () => {
    setSelectedProduct(null);
  };

  //   const {
  //     data: SavingProductData,
  //     isLoading,
  //     error
  //   } = useQuery({
  //     queryKey: ["getAllSavings"],
  //     queryFn: getAllSavings
  //   });

  const {
    data: SavingProductData,
    isLoading,
    error
  } = useQuery({
    queryKey: ["SavingProductData"],
    queryFn: getAllSavings
  });
  useEffect(() => {
    console.log("ddd", SavingProductData?.data);
  }, [SavingProductData]);

  //   if (SavingProductData?.data) return <></>;
  return (
    <>
      <div style={{ width: "850px", height: "410px" }}>
        {selectedProduct && SavingProductData ? (
          <SavingForm product={selectedProduct} onBack={handleBack} />
        ) : (
          <SavingTable
            products={SavingProductData?.data}
            onProductClick={handleProductClick}
          />
        )}
      </div>
    </>
  );
};

export default SavingTask;
