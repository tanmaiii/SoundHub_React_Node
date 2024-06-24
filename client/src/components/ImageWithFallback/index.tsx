import React, { useState } from 'react'

type props = {
    src: string;
    fallbackSrc?: string;
    alt: string;
    stype?: any;
}

function ImageWithFallback({ src, fallbackSrc, alt, stype}: props) {
    const [imgSrc, setImgSrc] = useState<string>(src);

    const handleError = () => {
        fallbackSrc && setImgSrc(fallbackSrc);
    };
  
    return (
      <img style={stype} src={imgSrc} alt={alt} onError={handleError} />
    );
}


export default ImageWithFallback
