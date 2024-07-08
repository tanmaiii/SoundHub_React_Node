import { use } from "i18next";
import React, { useEffect, useState } from "react";
import { apiConfig } from "../../configs";

type props = {
  src: string;
  fallbackSrc: string;
  alt: string;
  stype?: any;
};

function ImageWithFallback({ src, fallbackSrc, alt, stype }: props) {
  const [imgSrc, setImgSrc] = useState<string>();

  useEffect(() => {
    if (src !== "") {
      setImgSrc(apiConfig.imageURL(src));
    } else {
      setImgSrc(fallbackSrc);
    }
  }, [src]);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <img style={{verticalAlign: "middle", ...stype}} src={imgSrc} alt={alt} onError={handleError} />;
  }

export default ImageWithFallback;
