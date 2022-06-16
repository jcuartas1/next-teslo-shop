import { FC, useReducer } from "react";
import { UiContext, uiReducer } from './';


export interface UIState {
  isMenuOpen: boolean
}

interface Props {
  children?: React.ReactNode | undefined
}

const UI_INITIAL_STATE: UIState  = {
  isMenuOpen: false,
}


export const UIProvider:FC<Props> = ({children}) => {

  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);


  const toogleSideMenu = () => {
    dispatch({ type: 'UI - ToggleMenu' })
  }



  return (
    <UiContext.Provider value={{ 
      ...state,

      //Metodos
      toogleSideMenu,

     }}>

      { children }

    </UiContext.Provider>
  )
}
