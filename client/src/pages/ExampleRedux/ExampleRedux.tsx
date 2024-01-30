//rfpc
import React from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addNewHobby, setActiveHobby } from "../../actions/hobby";

const randomNumber = () => {
  return 1000 + Math.trunc(Math.random() * 9000);
};

export default function HomeExampleReduxage(props: any) {
//   const hobbyList = useSelector((state: any) => state.hobby.list);
//   const activeId = useSelector((state: any) => state.hobby.activeId);

//   const dispatch = useDispatch();

//   console.log(hobbyList, activeId);

//   const handleClick = () => {
//     const newId = randomNumber();

//     const newHobby = {
//       id: newId,
//       title: `Hobby ${newId}`,
//     };

//     const action = addNewHobby(newHobby);
//     dispatch(action);
//   };

//   const handleHobbyClick = (hobby: any) => {
//     const action = setActiveHobby(hobby);
//     dispatch(action);
//   };

//   return (
//     <div>
//       <button onClick={() => handleClick()}>Add hobbyList</button>
//       <HobbyList hobbyList={hobbyList} activeId={activeId} handleHobbyClick={handleHobbyClick} />
//     </div>
//   );
// }

// const HobbyList = (props: any) => {
//   const handleClick = (hobby: any) => {
//     console.log(hobby);
//     props.handleHobbyClick(hobby);
//   };

//   return (
//     <ul>
//       {props.hobbyList.map((hobby: any) => (
//         <li
//           key={hobby?.id}
//           className={hobby?.id === props?.activeId ? "active" : "active"}
//           style={hobby?.id === props?.activeId ? { color: "red" } : { color: "black" }}
//           onClick={() => handleClick(hobby)}
//         >
//           {hobby.title}
//         </li>
//       ))}
//     </ul>
//   );
};
