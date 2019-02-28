import { React, ReactDOM, connect, Provider, BrowserRouter, Switch, Route, createBrowserHistory,
    withStyles, classNames, CssBaseline, SnackbarProvider, withSnackbar
} from "./imports.jsx"


import store from "./store.jsx"
import styles from "./style.jsx"
import * as mainActions from "./actions.jsx"
import * as userActions from "../user/actions.jsx"


import MainAppBar from "./views/mainAppBar.jsx"
import Home from "./views/home.jsx"
import Landing from "./views/landing.jsx"
import Signin from "../user/views/signinForm.jsx"
import Signup from "../user/views/signupForm.jsx"
import Profile from "../user/views/profileForm.jsx"


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
                            component={Signin}
                            exact />
                        
                        <Route 
                            path="/signup" 
                            component={Signup} 
                            exact />

                        <Route 
                            path="/profile" 
                            component={Profile} 
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
        <BrowserRouter history={createBrowserHistory({basename: WP_CONF_BASE_URL})} >
            <SnackbarProvider maxSnack={3}>
                <StyledIndex/>
            </SnackbarProvider>
        </BrowserRouter>
    </Provider>, document.getElementById("index")
);