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
      stroke="#999"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 15.833c2.758 0 5-2.241 5-5V6.667c0-2.759-2.242-5-5-5s-5 2.241-5 5v4.166c0 2.759 2.242 5 5 5Z"
    />
    <path
      stroke="#999"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.5 9.167v1.666a7.5 7.5 0 0 0 15 0V9.167M7.592 6.233a6.667 6.667 0 0 1 4.583 0M8.358 8.733c1-.275 2.059-.275 3.059 0"
    />
  </svg>
)
export default SvgComponent
