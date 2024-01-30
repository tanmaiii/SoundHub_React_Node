const initialState = {
  list: [],
  activeId: null,
};

export const hobbyReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ADD_HOBBY": {
      const newList = [...state.list];
      newList.push(payload);

      return {
        ...state,
        list: newList,
      };
    }

    case "SET_ACTIVE_HOBBY": {
      const newActiveId = action.payload.id;
      return {
        ...state,
        activeId: newActiveId,
      };
    }

    default: {
      return state;
    }
  }
};
