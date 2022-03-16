const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      }; 
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: true,
      };
    case "UPDATE_START":
        return {
          ...state,
          isFetching:true
        };
    case "UPDATE_SUCCESS":
        return {
          user: action.payload,
          isFetching: false,
          error: false,
        };
    case "UPDATE_FAILURE":
        return {
          user: state.user,
          isFetching: false,
          error: true,
        }; 
    case "FOLLOW":
      return {
       ...state,           //this takes the state of above(ie login success(user, isfetchog....))
       user: {
         ...state.user,    //this will get all te props of user from context(don t need write all)
         followings: [...state.user.followings, action.payload],   //in the obtained state from conetxt, we take followings
                                                                  // we copy the following array [...state.user.following] and add the new followeduser sending it as the payload from follow 
       },
      };
    case "UNFOLLOW":
      return{
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter((following) => following !== action.payload), //filter will iterate over the existing values in the followig array, we will take each following (following) and return all the following will not be/except action.payload
        },
      };
    case "LOGOUT":
      return {
        user: null,  
        isFetching: false,
        error: false,
      };
      default: return state;
    }
};

    export default AuthReducer;