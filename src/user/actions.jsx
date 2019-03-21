import { PouchDB, remotedb, _t, utf8ToHex } from "../imports.jsx"

export const UPDATE_FORM_FIELD =            "UPDATE_FORM_FIELD"
export const INIT_PROFILE_FORM =            "INIT_PROFILE_FORM"

export const USER_PROFILE_IMAGE_UPDATED =   "USER_PROFILE_IMAGE_UPDATED"
export const USER_PROFILE_UPDATED =         "USER_PROFILE_UPDATED"

export const SIGNED_IN =                    "SIGNED_IN"
export const SIGNED_OUT =                   "SIGNED_OUT"
export const ERROR =                        "ERROR"


// user readable messages corresponding to couchdb errors
const couchdbErrMessages = {
    conflict: _t("Username already exists"),
    forbidden: _t("You are not allowed to authenticate with these credentials"),
    unauthorized: _t("Invalid user credentials"),
    authentication_error: _t("Invalid user credentials")
}

let userDB = null
let userRemoteDB = null



//create user db objects
const createUserDbObjects = username =>
{
    const userDbName = `userdb-${utf8ToHex(username)}`
    return [
        new PouchDB(userDbName), 
        new PouchDB(`${WP_CONF_REMOTE_DB_URL}/${userDbName}`, { 
            skip_setup: true,
            fetch: (url, opts) => {
                opts.credentials='include'
                return PouchDB.fetch(url, opts)
            }})
    ]
}



// sign in the user to couchdb
export const signIn = props => async dispatch => {
    try {
        remotedb.logIn(props.username, props.password).then(() => {
            [userDB, userRemoteDB] = createUserDbObjects(props.username)

            userRemoteDB.logIn(props.username, props.password).then(() => {
                userDB.sync(userRemoteDB, { live: true, retry: true })
                dispatch(retreiveUserData(props.username))
            })
        })
    }
    catch(err) { 
        dispatch({
            type: ERROR,  
            payload: couchdbErrMessages[err.name] || _t("Network error")
        })
    }
}



// retreive user data
const retreiveUserData = username => async dispatch => {
    let profileImg = {_id: "profileImg"}

    remotedb.getUser(username).then(userMetaData => 
        userDB.get('profileImg', {attachments: true, binary: true}, async (err, profileImgDoc) => {
            if (err){
                if (err.reason === "missing")
                    await userDB.put(profileImg)
                else 
                    throw err
            }
            else     
                profileImg = profileImgDoc

            dispatch({
                type: SIGNED_IN,  
                payload: {...userMetaData, ...profileImg}
            })
        }))
    .catch(err =>
        dispatch({
            type: ERROR,  
            payload: couchdbErrMessages[err.name] || _t("Network error")
        }))
}



// get session from couchdb in case there is still a valid one
export const getSession = () => async dispatch => {
    try {
        remotedb.getSession().then(response => {
            const username = response.userCtx.name
            if (!username)
                return
            
            [userDB, userRemoteDB] = createUserDbObjects(username)
            
            userRemoteDB.getSession().then(() => {
                userDB.sync(userRemoteDB, { live: true, retry: true })
                dispatch(retreiveUserData(username))
            })
        })
    }
    catch(err){
        dispatch({
            type: ERROR, 
            payload: _t("Error while retreiving user session")
        })
    }
}



// initialize edit user profile form with existing data from signed in user 
export const initProfileForm = () => dispatch => 
    dispatch({ type: INIT_PROFILE_FORM })



// update a form field in state
export const updateFormField = (id, value, form) => async dispatch =>
    dispatch({
        type: UPDATE_FORM_FIELD, 
        payload: {
            id: id, 
            value:value, 
            form: form
        }
    })
    


// update user profile fields
export const updateProfile = props => dispatch => {
    let userData = {}
    if (props.password || props.repeatPassword)
    {
        if (props.password !== props.repeatPassword)
        return dispatch({
            type:ERROR, 
            payload: _t("Passwords do not match")
        })
        userData.password = props.password
    }

    if (props.firstName) 
        userData.firstName = props.firstName

    if (props.lastName) 
        userData.lastName = props.lastName

    remotedb.putUser(props.username, { metadata : userData }).then(() => 
        remotedb.getUser(props.username).then(doc => 
            dispatch({
                type: USER_PROFILE_UPDATED,  
                payload: doc
            }))
    
    ).catch(() => 
        dispatch({
            type: ERROR, 
            payload: _t("Error while updating the user profile")
        }))
}



// upload user profile image to couchdb
export const addUserImg = (username, path, file) => dispatch =>
{
	if (!path.split(".").length)
        return
        
    let profileImgDoc = {_id: 'profileImg'}
    userDB.get('profileImg').then(doc => profileImgDoc = doc).finally(() => {

		const imgName = "profile." + file.name.split(".").reverse()[0]
		userDB.put({
            ...profileImgDoc,
			img: imgName,
            _attachments: { 
                [imgName]: {content_type: file.type, data: file}
            }
		})
        .then(() => 
            userDB.get('profileImg', {
                attachments: true, 
                binary: true
            }).then(doc => 
                dispatch({
                    type: USER_PROFILE_IMAGE_UPDATED,  
                    payload: doc
                })
            ))
	})
}


// sign up the user to couchdb
export const signUp = props => dispatch => {
    if (props.password !== props.repeatPassword)
        return dispatch({type: ERROR, payload: _t("Passwords do not match")})

    try {
        remotedb.signUp(props.username, props.password, {
            metadata : {
                firstName: props.firstName, 
                lastName: props.lastName
            }
        }).then(() => dispatch(signIn(props)))    
    }
    catch (err) { 
        dispatch({
            type: ERROR,  
            payload: couchdbErrMessages[err.name] || _t("Network error")
        })
    }
}
      

// sign out the user from couchdb
export const signOut = (firstName, lastName) => dispatch => 
    remotedb.logOut().then(() => 
        dispatch({
            type: SIGNED_OUT, 
            payload: {
                firstName: firstName, 
                lastName: lastName
            }}))

    .catch(() => 
        dispatch({
            type: ERROR,  
            payload: _t("Couldn't sign out")
        }))
