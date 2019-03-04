import { db, remotedb, _t } from "../imports.jsx"

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
  

// get session from couchdb in case there is still a valid user session
export const getSession = () => dispatch => 
    remotedb.getSession(
        (err, response) =>
            !err && response.userCtx.name && db.get(
                "User" + response.userCtx.name, 
                {
                    attachments: true, 
                    binary: true
                })
                .then(doc => dispatch({ type: SIGNED_IN,  payload: doc })))


// initialize edit user profile form with existing data from signed in user 
export const initProfileForm = () => dispatch => 
    dispatch({ type: INIT_PROFILE_FORM })


// update a form field in state
export const updateFormField = (id, value, form) => dispatch =>
    dispatch({
        type: UPDATE_FORM_FIELD, 
        payload: {
            id: id, 
            value:value, 
            form: form
        }
    })
    

// update user profile fields
export const updateProfile = props => dispatch =>
    db.get("User" + props.username, {
        attachments: true, 
        binary: true
    }).then(user => 
        {
            if (props.password || props.repeatPassword)
            {
                if (props.password !== props.repeatPassword)
                return dispatch({
                    type:ERROR, 
                    payload: _t("Passwords do not match")
                })

                user.password = props.password
            }

            if (props.firstName) 
                user.firstName = props.firstName

            if (props.lastName) 
                user.lastName = props.lastName

            db.put(user).then(() => db.get('User' + props.username)
                .then(doc => 
                    dispatch({
                        type: USER_PROFILE_UPDATED,  
                        payload: doc
                    }))
            
            ).catch(err => 
                dispatch({
                    type: ERROR, 
                    payload: _t("Error while updating the user profile")
                }))
        })


// upload user profile image to couchdb
export const addUserImg = (username, path, file) => dispatch =>
{
	if (!path.split(".").length)
        return
        
    db.get("User" + username).then(doc => 
    {
		const imgName = "profile." + file.name.split(".").reverse()[0]
		db.put({
            ...doc, 
			img: imgName,
            _attachments: {
                ...(doc._attachments||{}), 
                [imgName]: {content_type: file.type, data: file}
            }
		})
        .then(() => 
            db.get('User' + username, 
                    {
                        attachments: true, 
                        binary: true
                    })
            .then(doc => 
                dispatch({
                    type: USER_PROFILE_IMAGE_UPDATED,  
                    payload: doc
                })
            ))
	})
}


// sign in the user to couchdb
export const signIn = props => dispatch =>
    remotedb.logIn(props.username, props.password)
        .then(() => 
            db.get("User" + props.username, 
                    {
                        attachments: true, 
                        binary: true
                    })
            .then(doc => 
                dispatch({
                    type: SIGNED_IN,  
                    payload: doc
                })))
        .catch(err => 
            dispatch({
                type: ERROR,  
                payload: couchdbErrMessages[err.name] || _t("Network error")
            }))


// sign up the user to couchdb
export const signUp = props => dispatch =>
{
    if (props.password !== props.repeatPassword)
        return dispatch({type: ERROR, payload: _t("Passwords do not match")})

    remotedb.signUp(props.username, props.password)
        .then(() => 
            db.put({
                _id:'User' + props.username, 
                cnt:1, 
                username: props.username,
                firstName: props.firstName, 
                lastName: props.lastName
            })
            .then(()=>
                db.get('User' + props.username, 
                        {
                            attachments: true, 
                            binary: true
                        })
                .then(doc => 
                    dispatch({
                        type: SIGNED_IN,
                        payload: doc
                    })))
        )
        .catch ( err => 
            dispatch({
                type: ERROR,  
                payload: couchdbErrMessages[err.name] || _t("Network error")
        }))
}
      

// sign out the user from couchdb
export const signOut = (firstName, lastName) => dispatch => 
    remotedb.logOut()
        .then(() => 
            dispatch({
                type: SIGNED_OUT, 
                payload: {
                    firstName: firstName, 
                    lastName: lastName
                }}))
        
        .catch(err => 
            dispatch({
                type: ERROR,  
                payload: _t("Couldn't sign out")
            }))
