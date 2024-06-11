import React, { useEffect } from "react";
import Button from "../Button";
import "./style.scss";

const AddressInput = ({
  postcode,
  setPostcode,
  address,
  setAddress,
  detailAddress,
  setDetailAddress
}) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const sample6_execDaumPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        let fullAddr = data.address;
        let extraAddr = "";

        if (data.addressType === "R") {
          if (data.bname !== "") {
            extraAddr += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddr +=
              extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          }
          fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
        }

        setPostcode(data.zonecode);
        setAddress(fullAddr);
      }
    }).open();
  };

  return (
    <div>
      <input
        type="text"
        id="sample6_postcode"
        placeholder="우편번호"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />
      <Button type="button" onClick={sample6_execDaumPostcode}>
        우편번호 찾기
      </Button>
      <br />
      <div id="addressDiv">
        <input
          type="text"
          id="sample6_address"
          placeholder="주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <br />
        <input
          type="text"
          id="sample6_detailAddress"
          placeholder="상세주소"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddressInput;
