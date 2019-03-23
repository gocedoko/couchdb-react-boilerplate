import { React, ReactDOM, connect, Provider, Router, Switch, Route, createBrowserHistory,
    withStyles, classNames, CssBaseline, SnackbarProvider, withSnackbar
} from "./imports.jsx"


import store from "./store.jsx"
import styles from "./common/style.jsx"
import * as mainActions from "./common/actions.jsx"
import * as userActions from "./user/actions.jsx"


import { MainAppBar } from "./common/views/mainAppBar.jsx"
import { Home } from "./common/views/home.jsx"
import { Landing } from "./common/views/landing.jsx"
import { SignInForm } from "./user/views/signinForm.jsx"
import { SignUpForm } from "./user/views/signupForm.jsx"
import { ProfileForm } from "./user/views/profileForm.jsx"


class Index extends React.Component {
    componentDidMount(){
        this.props.getSession()
    }

    componentDidUpdate(){
        if (this.props.errMsg){
            this.props.enqueueSnackbar(this.props.errMsg, {variant: "error"})
            this.props.clearErrorMessage()
        }

        if (this.props.infoMsg){
            this.props.enqueueSnackbar(this.props.infoMsg, {variant: "success"})
            this.props.clearInfoMessage()
        }
    }

    render(){
        const props = this.props

        return <div className={classNames(props.classes.root)}>
            
            <CssBaseline />

            <MainAppBar/>

            <main 
                className={props.classes.content}>
                    <Switch>
                        <Route 
                            path="/"
                            component={props.signedIn ? Home : Landing} 
                            exact />

                        <Route 
                            path="/signin" 
                            component={SignInForm}
                            exact />
                        
                        <Route 
                            path={"/signup"}
                            component={SignUpForm} 
                            exact />

                        <Route 
                            path={"/profile"} 
                            component={ProfileForm} 
                            exact />
                    </Switch>
            </main>
        </div>
    }
}



const StyledIndex = connect(
    state => ({
        signedIn: state.signedIn,
        shownMenu: state.shownMenu,
        language: state.language,
        errMsg: state.errMsg,
        infoMsg: state.infoMsg
    }),
    dispatch => ({
        getSession: () => dispatch(userActions.getSession()),
        clearErrorMessage: () => dispatch(mainActions.clearErrorMessage()),
        clearInfoMessage: () => dispatch(mainActions.clearInfoMessage())
    })
)(withSnackbar(withStyles(styles)(Index)))


ReactDOM.render(
    <Provider store={store}>
        <Router history={createBrowserHistory({basename: WP_CONF_BASE_URL})} >
            <SnackbarProvider maxSnack={3}>
                <StyledIndex/>
            </SnackbarProvider>
        </Router>
    </Provider>, document.getElementById("index")
);