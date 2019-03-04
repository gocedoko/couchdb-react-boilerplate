import { React, connect, _t, Link, Redirect,
		withStyles, LockOutlinedIcon, Avatar, Button, Paper, Typography
} from "../../imports.jsx"

import styles from "../style.jsx"
import * as userActions from "../actions.jsx"
import { CustomInputControl } from "../../common/components.jsx"


class SignUpForm extends React.Component {
	render(){
		const props = this.props

		return props.signedIn 
		
			// if already signed in
			? <Redirect to="/"/>
	
			// else show the sign in form
			: <main className={props.classes.main}>
				<Paper className={props.classes.paper}>
			
					<Avatar className={props.classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>

					<Typography 
						component="h1" 
						variant="h5"> 
							{_t('Sign up')} 
					</Typography>

					<form className={props.classes.form}>

						<CIControl 
							id="firstName" 
							label={_t('First Name')} 
							autoFocus={true}/>
						
						<CIControl 
							id="lastName" 
							label={_t('Last Name')}/>

						
						<CIControl 
							id="username" 
							label={_t('New Username')} />
						
						<CIControl 
							id="password" 
							label={_t('New Password')} 
							type="password" />
						
						<CIControl 
							id="repeatPassword" 
							label={_t('Repeat Password')} 
							type="password" />
						
						<CIControl 
							id="email" 
							label={_t('Email Address')} />

						<Button 
							fullWidth 
							variant="contained" 
							color="primary" 
							className={props.classes.submit} 
							onClick={()=>props.signUp(props.signUpForm)}> 
								{_t('Submit')}
						</Button>

						<Button 
							fullWidth 
							variant="contained" 
							color="secondary" 
							className={props.classes.submit}> 
							
								<Link to="/" className={props.classes.link}>
									{_t('Cancel')}
								</Link>
						</Button>
					</form>
				</Paper>
			</main>
	}
}


// connect the general input control to state, by its "id"
const CIControl = connect(
	null,
	dispatch => ({ 
		onChange: (id, value) => dispatch(userActions.updateFormField(id, value, "signUpForm")) 
	})
)(CustomInputControl)



// connect the sign up form to state 
export default connect(
	state => ({
		signedIn: state.signedIn,
		signUpForm: state.signUpForm,
		language: state.language
	}),
	dispatch => ({
		signUp: props => dispatch(userActions.signUp(props))
	})
)(withStyles(styles)(SignUpForm))



