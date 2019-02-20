import { React, connect, _t, Redirect, Link,
		withStyles, Avatar, Button, LockOutlinedIcon, Paper, Typography
} from "../../common/imports.jsx"

import styles from "../style.jsx"
import * as userActions from "../actions.jsx"
import { CustomInputControl } from "../../common/components.jsx"


class SignInForm extends React.Component {
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
							{_t('Sign in')} 
					</Typography>
							
					<form className={props.classes.form}>
		
						<input 
							type="hidden" 
							value="just a dummy because of a chrome bug"/>
		
						<CIControl 
							id="username" 
							label={_t('Username')} 
							autoFocus 
							form={"signInForm"}/>

						<CIControl 
							id="password" 
							label={_t('Password')} 
							type="password" 
							form={"signInForm"}/>

						<Button 
							fullWidth 
							variant="contained" 
							color="primary"
							className={props.classes.submit} 
							onClick={()=>props.signIn(props.signInForm)}> 
								{_t('Sign in')}
						</Button>

						<Link 
							to="/signup" 
							className={props.classes.link}>
					
								<Button 
									id="register" 
									fullWidth 
									variant="contained" 
									className={props.classes.button}>
										{_t('Not a user? Sign up here')}
								</Button>
						</Link>
					</form>
				</Paper>
			</main>
	}
}


// connect the general input control to state, by its "id"
const CIControl = connect(
	null,
	dispatch => ({ 
		onChange: (id, value) => dispatch(userActions.updateFormField(id, value, "signInForm")) 
	})
)(CustomInputControl)



// connect the sign in form to state 
export default connect(
	state => ({
		signedIn: state.signedIn,
		signInForm: state.signInForm,
		language: state.language
	}),

	dispatch => ({
		signIn: props => dispatch(userActions.signIn(props)),
	})
)(withStyles(styles)(SignInForm))