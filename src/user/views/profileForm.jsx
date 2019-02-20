import { React, connect, _t, Redirect, Link,
		withStyles, Paper, Typography, Button} from "../../common/imports.jsx"

import { CustomInputControl, UserImageControl } from "../../common/components.jsx"

import styles from "../style.jsx"
import * as userActions from "../actions.jsx"


class ProfileForm extends React.Component {

	componentDidMount(){
		this.props.initProfileForm()
	}

	render(){
		const props = this.props

		return props.signedIn ? 

			props.userProfileForm ?

				// if the user profile form is initialized
				<main className={props.classes.main}>
					<Paper className={props.classes.paper}>
				
						<UImgControl 
							id="imagePath" 
							label={_t('Image')} 
							classes={props.classes}
							username={props.userProfileForm.username}
							src={props.userProfileForm.imageData} />
	
						<Typography 
							component="h1" 
							variant="h5"> 
								{props.userProfileForm.username} 
						</Typography>
	
						<form className={props.classes.form}>
							<React.Fragment>
					
								<CIControl 
									id="firstName" 
									label={_t('First Name')}/>
					
								<CIControl 
									id="lastName" 
									label={_t('Last Name')}/>
					
								<CIControl 
									id="password" 
									label={_t('New Password')} 
									type="password"
									optional={true}
									/>
								
								<CIControl 
									id="repeatPassword" 
									label={_t('Repeat Password')} 
									type="password"
									optional={!props.userProfileForm.password}
									/>

								<Button 
									fullWidth 
									variant="contained" 
									color="primary" 
									className={props.classes.submit} 
									onClick={()=>props.updateProfile(props.userProfileForm)}> 
										{_t('Submit')}
								</Button>

								<Link 
									to="/" 
									className={props.classes.link}>
										<Button 
											fullWidth 
											variant="contained" 
											color="secondary" 
											className={props.classes.submit}> 
												{_t('Cancel')}
										</Button>
								</Link>

							</React.Fragment>
						</form>
					</Paper>
				</main>

			// if user profile form is not yet initialized
			: <React.Fragment/>
			
		// if user is logged out or session is expired
		: <Redirect to="/signin"/>
	}
}


// connect the general input control to state, by its "id"
const CIControl = connect(
	(state, ownProps) => ({
		value: state.userProfileForm[ownProps.id] || state.signedInUserData[ownProps.id]
	}),
	dispatch => ({ 
		onChange: (id, value) => dispatch(
			userActions.updateFormField(id, value, "userProfileForm")),
	})
)(CustomInputControl)



// connect the user image control to state
const UImgControl = connect(
	state => ({
		username: state.userProfileForm.username
	}),
	dispatch => ({ 
		onChange: (username, path, files) => dispatch(userActions.addUserImg(username, path, files[0]))
	})
)(UserImageControl)



// connect the edit user profile form to state 
export default connect(
	state => ({
		signedIn: state.signedIn,
		userProfileForm: state.userProfileForm
	}),
	dispatch => ({
		initProfileForm: () => dispatch(userActions.initProfileForm()),
		updateProfile: props => dispatch(userActions.updateProfile(props))
	})	
)(withStyles(styles)(ProfileForm))
