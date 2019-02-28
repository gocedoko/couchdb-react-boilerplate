// Config

import config from "../../config.json"


// React and related

import React from "react"
import ReactDOM from "react-dom"
import { Provider, connect } from "react-redux"
import { BrowserRouter, Link, Route, Switch, Redirect } from 'react-router-dom'
import { createBrowserHistory } from 'history';
export { React, ReactDOM, Provider, connect, 
        BrowserRouter, Link, Route, Switch, Redirect, createBrowserHistory }



// PouchDB connection

import PouchDB from 'pouchdb'
import PouchDBAuth from 'pouchdb-authentication'

    PouchDB.plugin(PouchDBAuth)
    const remotedb = new PouchDB(config.remote_db_url, {skip_setup: true})
    const db = new PouchDB('local_db')
    db.sync(remotedb, {live: true, retry: true})

export { PouchDB, db, remotedb }



// Localization

import i18n from 'i18next'
import LngDetector from 'i18next-browser-languagedetector'
import en from "../../assets/i18n/en/translation.json"
import de from "../../assets/i18n/de/translation.json"
import zh from "../../assets/i18n/zh/translation.json"

    i18n.use(LngDetector).init({
        debug: true,
        detection: {
            lookupQuerystring: 'lng',
            lookupCookie: 'i18next',
            order: ['querystring', 'cookie', 'localStorage', 'navigator', 
                    'htmlTag', 'path', 'subdomain'],
            cookieMinutes: 10,
            cookieDomain: 'umpDomain',
        },
        nsSeparator: false,
        keySeparator: false,
        resources: {
            en: { translation: en },
            de: { translation: de },
            zh: { translation: zh }
        }
    })

    const lngs = [
        {shortName: 'en', name: 'English'}, 
        {shortName: 'de', name: 'Deutsch'}, 
        {shortName: 'zh', name: '中文'}]

    const _t = t => i18n.t(t)

export { i18n, _t, lngs }



// Material-UI

import classNames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import AppBar from '@material-ui/core/AppBar'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import Toolbar from '@material-ui/core/Toolbar'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import MenuIcon from '@material-ui/icons/Menu'
import PersonIcon from '@material-ui/icons/Person'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import NotificationsIcon from '@material-ui/icons/Notifications'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import LanguageIcon from '@material-ui/icons/Language'
import PeopleIcon from '@material-ui/icons/People'
import Tooltip from '@material-ui/core/Tooltip'
export { AppBar, Avatar, Button, CssBaseline, FormControl, FormControlLabel, Checkbox, Input, InputLabel, 
        LockOutlinedIcon, Paper, Typography, Drawer, Toolbar, List, Divider, IconButton, Badge, Menu, 
        MenuItem, MenuIcon, ChevronLeftIcon, NotificationsIcon, ListItem, ListItemIcon, ListItemText, 
        DashboardIcon, LanguageIcon, PeopleIcon, Tooltip, withStyles, PersonIcon, classNames }



// Snackbar Notifications

import { SnackbarProvider, withSnackbar } from 'notistack'
export { SnackbarProvider, withSnackbar }



// Menus

const LANGUAGE_MENU ="LANGUAGE_MENU"
export { LANGUAGE_MENU }



// Create binary Image URL 

const createImageURL = image => URL.createObjectURL(new Blob([image.data], {type: image.type}))
export { createImageURL }