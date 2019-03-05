import { createStore, applyMiddleware, thunkMiddleware, createLogger, 
        _t, createImageURL, utf8ToHex } from "./imports.jsx"

const initialState = {
}

const reducerFunctions = {

    '@@INIT' : initialState,

    '@@redux/INIT' : initialState,

    // set the 'showMenu' state
    SHOW_MENU: (state, payload) => ({
        ...state, 
        shownMenu: payload
    }),

    // fill in existing user data; called when showing the user profile form
    INIT_PROFILE_FORM: (state) => ({
        ...state, 
        userProfileForm: state.signedInUserData
    }),

    // update the state of any value change in CustomInputControl
    UPDATE_FORM_FIELD: (state, payload) => ({
        ...state, 
        [payload.form]: {
            ...state[payload.form], 
            [payload.id]: payload.value
        }
    }),

    // update new user data in state, after succesfully changing it in the database
    USER_PROFILE_UPDATED: (state, payload) => ({
        ...state,
        errMsg: '',
        signedInUserData: {
            ...state.signedInUserData,
            username: payload.username, 
            firstName: payload.firstName,
            lastName: payload.lastName,
        },
        infoMsg: `${_t('Successfully saved user data for')} ${payload.firstName} ${payload.lastName}`
    }),

    // update new user image in the state, after succesfully changing it in the database
    USER_PROFILE_IMAGE_UPDATED: (state, payload) => {
        if (!payload.img) return state

        const imageData = payload._attachments[payload.img]
            ? createImageURL(payload._attachments[payload.img]) 
            : "assets/img/userm.png"
        
        return {
            ...state, 
            signedInUserData: {
                ...state.signedInUserData, 
                imageData: imageData
            },
            userProfileForm: {
                ...state.userProfileForm, 
                imageData: imageData
            },
            infoMsg: `${_t('Successfully updated user image for')} ${payload.firstName} ${payload.lastName}`
        }
    },

    // store a general error message in state, to activate snackbar notifications
    ERROR: (state, payload) => ({
        ...state, 
        errMsg: payload
    }),

    // clear the error message from the state
    CLEAR_ERROR_MESSAGE: state => ({
        ...state, 
        errMsg: ""
    }),

    // clear info message from the state
    CLEAR_INFO_MESSAGE: state => ({
        ...state, 
        infoMsg: ""
    }),
       
    // update user data in state after successful sign in
    SIGNED_IN: (state, payload) => ({
        ...state, 
        signedIn: true, 
        signedInUserData: {
            username: payload.username, 
            firstName: payload.firstName,
            lastName: payload.lastName,
            hexUsername: utf8ToHex(payload.username),
            imageData: payload.img && payload._attachments[payload.img]
                ? createImageURL(payload._attachments[payload.img]) 
                : "assets/img/userm.png"
        },
        infoMsg: `${payload.firstName} ${payload.lastName} ${_t('is signed in')}!`
    }),

    // reset state after successful sign out
    SIGNED_OUT: (state, payload) => ({
        ...initialState, 
        infoMsg: `${payload.firstName} ${payload.lastName} ${_t('is signed out')}!`
    }),

    // update language in state after a successfful language change
    LANGUAGE_CHANGED: (state, payload) => ({
        ...state,
        language: payload.shortName,
        infoMsg: `${_t('Language changed to')} ${payload.name}!`
    })
}


export default createStore (
    (state = initialState, action) => 
        (reducerFunctions[action.type] || (()=>initialState)) (state, action.payload),
    
    applyMiddleware(
        thunkMiddleware,
        createLogger()
    )
)