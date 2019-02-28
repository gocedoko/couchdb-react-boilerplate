import { React, connect, _t, Button, withStyles, Avatar, LockOutlinedIcon, Link } 
	from "../../common/imports.jsx"

import styles from "../style.jsx"
import * as userActions from "../actions.jsx"


class UserBarMenu extends React.Component {
	render(){
		const props = this.props

		return props.signedIn
		
			? <React.Fragment>
				<Link 
					to={`${WP_CONF_BASE_URL}profile`} 
					className={props.classes.link}>
						<Avatar 
							className={props.classes.avatar} 
							src={props.signedInUserData.imageData}>
								<LockOutlinedIcon />
						</Avatar>
				</Link>

				<Button 
					size="medium" 
					color="inherit" 
					className={props.classes.margin}
					onClick={() => props.signOut(
								props.signedInUserData.firstName, 
								props.signedInUserData.lastName
							)}>
						{_t("Sign out")}
				</Button>
			</React.Fragment>
	
			: <Link 
					to={`${WP_CONF_BASE_URL}signin`} 
					className={props.classes.link}>
						<Button 
							size="medium" 
							color="inherit" 
							className={props.classes.margin}>
								{_t("Sign in")}
						</Button>
			</Link>
	}
}


// connect the user bar to state
export default connect(
	state => ({
		language: state.language,
		signedIn: state.signedIn,
		signedInUserData: state.signedInUserData
	}),
	dispatch => ({
		signOut: (firstName, lastName) => dispatch(userActions.signOut(firstName, lastName))
	})
)(withStyles(styles)(UserBarMenu))