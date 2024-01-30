import * as React from "react"
const SvgComponent = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      d="m16.7 5.683-4.8-3.358c-1.308-.917-3.317-.867-4.575.108L3.15 5.692c-.833.65-1.492 1.983-1.492 3.033v5.75a3.859 3.859 0 0 0 3.85 3.858h8.984a3.852 3.852 0 0 0 3.85-3.85v-5.65c0-1.125-.725-2.508-1.642-3.15ZM10.625 15a.63.63 0 0 1-.625.625.63.63 0 0 1-.625-.625v-2.5a.63.63 0 0 1 .625-.625.63.63 0 0 1 .625.625V15Z"
    />
  </svg>
)
export default SvgComponent
