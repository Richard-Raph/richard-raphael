export const useWindowReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN':
            if (action.deviceState?.isSmallScreen || !action.deviceState?.isLaptopAndAbove) {
                if (state.windows.length > 0) {
                    return {
                        ...state,
                        active: action.id,
                        stack: [action.id],
                        windows: state.windows.map(w => ({
                            ...w,
                            id: action.id,
                            name: action.id,
                            isMinimized: false,
                            content: action.content,
                        })),
                    };
                }
            }

            return {
                ...state,
                active: action.id,
                stack: [...state.stack.filter(id => id !== action.id), action.id],
                windows: state.windows.some(w => w.id === action.id)
                    ? state.windows.map(w => w.id === action.id ? { ...w, isMinimized: false } : w)
                    : [...state.windows, { id: action.id, name: action.id, isMinimized: false, isMaximized: false }],
            };

        case 'CLOSE':
            return {
                ...state,
                stack: state.stack.filter(id => id !== action.id),
                active: state.stack[state.stack.length - 2] || null,
                windows: state.windows.filter(w => w.id !== action.id),
            };

        case 'MINIMIZE':
            return {
                ...state,
                stack: state.stack.filter(id => id !== action.id),
                active: state.stack[state.stack.length - 2] || null,
                windows: state.windows.map(w => w.id === action.id ? { ...w, isMinimized: !w.isMinimized } : w),
            };

        case 'MAXIMIZE':
            return {
                ...state,
                windows: state.windows.map(w => w.id === action.id ? { ...w, isMaximized: !w.isMaximized, isMinimized: false } : w),
            };

        case 'CLOSE_ALL':
            return { stack: [], windows: [], active: null };

        default:
            return state;
    }
};