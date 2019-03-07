import { React, connect, _t, Redirect, Link,
		withStyles, Paper, Typography, Button} from "../../imports.jsx"

import { CustomInputControl, UserImageControl } from "../../common/components.jsx"

import styles from "../style.jsx"
import * as userActions from "../actions.jsx"


class _ProfileForm extends React.Component {
	constructor(props)
	{
		super(props)
		this.CIControl = attr  => <CustomInputControl
										{...attr}
										value={props.userProfileForm[attr.id] 
												|| props.signedInUserData[attr.id]}
										onChange={props.updateFormField}
									/>

		this.UImgControl = attr => <UserImageControl
										{...attr}
										username={props.userProfileForm.username
												|| props.signedInUserData.username}
										onChange={props.updateProfileImg}
									/>
	}


	componentDidMount(){
		this.props.initProfileForm()
	}


	render(){
		const props = this.props
		const CIControl = this.CIControl
		const UImgControl = this.UImgControl


		return props.signedIn ? 

			props.userProfileForm ?

				// if the user profile form is initialized
				<main className={props.classes.main}>
					<Paper className={props.classes.paper}>
				
						<UImgControl 
							id="imagePath" 
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
									id="submitButton"
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


// connect the edit user profile form to state 
const ProfileForm = connect(
	state => ({
		signedIn: state.signedIn,
		userProfileForm: state.userProfileForm,
		signedInUserData: state.signedInUserData
	}),
	dispatch => ({
		initProfileForm: () => dispatch(userActions.initProfileForm()),

		updateFormField: (id, value) => 
			dispatch(userActions.updateFormField(id, value, "userProfileForm")),

		updateProfileImg: (username, path, files) => 
			dispatch(userActions.addUserImg(username, path, files[0])),

		updateProfile: props => dispatch(userActions.updateProfile(props))
	})	
)(withStyles(styles)(_ProfileForm))



export { _ProfileForm, ProfileForm }