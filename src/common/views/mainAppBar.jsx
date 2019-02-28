import { React, connect, i18n, _t, lngs, withStyles, classNames, Link, 
    IconButton, Badge, Menu, MenuItem, Typography, Toolbar, LanguageIcon,
    AppBar, LANGUAGE_MENU
} from "../imports.jsx"

import styles from "../style.jsx"
import * as mainActions from "../actions.jsx"
import UserBarMenu from "../../user/views/userBarMenu.jsx"

class MainAppBar extends React.Component {
	render(){
        const props = this.props

        return <AppBar 
            position="absolute" 
            className={classNames(props.classes.appBar)}>
                <Toolbar 
                    className={props.classes.toolbar}>

                        <Typography 
                            component="h1" 
                            variant="h6" 
                            color="inherit" 
                            className={props.classes.title}>
                                <Link to={WP_CONF_BASE_URL} className={props.classes.link}>
                                    Couchdb-React Boilerplate
                                </Link>
                        </Typography>

                        <Menu 
                            open={props.shownMenu===LANGUAGE_MENU}  
                            anchorEl={this.anchorEl}
                            onClose={props.showMenu}>
                                {lngs.map(l =>
                                    <MenuItem 
                                        key={l.shortName} 
                                        selected={i18n.language == l.shortName} 
                                        onClick={() => props.changeLanguage(l)}>
                                            {l.name}
                                    </MenuItem>
                                )}
                        </Menu>
                    
                        <IconButton 
                            color="inherit" 
                            aria-haspopup="true" 
                            buttonRef={node => this.anchorEl = node}
                            onClick={() => props.showMenu(LANGUAGE_MENU)}>
                                <Badge 
                                    size="medium" 
                                    badgeContent={props.language} 
                                    color="primary">
                                        <LanguageIcon/>
                                </Badge>
                        </IconButton>

                        <UserBarMenu />
                </Toolbar>
            </AppBar>
    }
}


export default connect(
	state => ({
        shownMenu: state.shownMenu,
        language: state.language,
	}),
	dispatch => ({
		showMenu: menu => dispatch(mainActions.showMenu(menu)),
        changeLanguage: language => dispatch(mainActions.changeLanguage(language)),
	})
)(withStyles(styles)(MainAppBar))