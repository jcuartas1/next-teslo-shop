import { AuthState } from ".";
import { IUser } from "../../interfaces";


type AUTHActionType = 
| { type: 'AUTH - Login', payload: IUser }
| { type: 'AUTH - Logout'}


export const authReducer = (state: AuthState, action: AUTHActionType): AuthState => {

  switch (action.type) {
    case 'AUTH - Login':
      return{
        ...state,
        isLoggedIn: true,
        user: action.payload
      }

    case 'AUTH - Logout':
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
        
      }  
  
    default:
      return state;
  }

}