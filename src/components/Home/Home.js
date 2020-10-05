import { AppBar, Avatar, Button, CssBaseline, Divider, Drawer, Hidden, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Menu, MenuItem, TextField, Toolbar } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
// import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import EditIcon from '@material-ui/icons/Edit';
import { Delete } from '@material-ui/icons';

import { Container, Form } from 'react-bootstrap';

import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';

import config from '../../config/config';
import Middle from '../Middle/Middle';

import { ToastContainer, toast } from 'react-toastify';
import ReactModal from 'react-modal';
import './Home.css'
import Auth from '../../config/authenticate';

const axios = require('axios');
const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('xs')]: {
      // width: `calc(100% - ${drawerWidth}px)`,
      width: `100%`,
      zIndex: '3000',
      marginLeft: drawerWidth,
      backgroundColor:'#0b64b8'
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function Home(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const history = useHistory()

    // Side drawer state and handler for mobile
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
 
    const [boards, setBoards] = useState([]);
    const [boardTitle, setBoardTitle] = useState('');
    const [currentBoard, setCurrentBoard] = useState({});

    // Create new board modal state and handlers
    const [createBoardShow, setCreateBoardShow] = useState(false); // for new board modal
    const createModalClose = () => setCreateBoardShow(false); // for modal close
    const createModalOpen = () => setCreateBoardShow(true); // for modal open

    // Edit board modal state and handlers
    const [editBoardShow, setEditBoardShow] = useState(false); // for new board modal
    const editModalClose = () => setEditBoardShow(false); // for modal close
    const editModalOpen = (board) => {; // for modal open
        setCurrentBoard({...currentBoard, ...board})
        closeOptionsMenu()
        setEditBoardShow(true)
        boardEditModal(board)
    }
   
    // option menu state and handlers to delete board and edit board 
    const [optionsAnchorEl, setOptionsAnchorEl] = React.useState(null); 
    const optionsOpen = Boolean(optionsAnchorEl);
    const toggleOptionsMenu = (e, board) => {
        setCurrentBoard({...currentBoard, ...board})
        setOptionsAnchorEl(e.currentTarget);
        boardOptionsMenu(board)
    };

    const closeOptionsMenu = () => {
        setOptionsAnchorEl(null);
    };
 
    // profile menu state and handlers to delete board and edit board 
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = React.useState(null); 
    const profileMenuOpen = Boolean(profileMenuAnchorEl);
    const toggleProfileMenu = (event) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const closeProfileMenu = () => {
        setProfileMenuAnchorEl(null);
    };
 
    const getBoards = () => {
        var payload = {
            method: 'get',
            url: `${config().url}/board`,
            headers: config().headers,
            data : ''
        };
        axios(payload)
        .then(function (response) {
            setBoards(response.data.boards)

        })
        .catch(function(err) {
            console.log(err)
        })
    }

    useEffect(() => {
        getBoards()
    }, [])
    // this is where i get the boards

    const createBoard = (e) => {
        e.preventDefault()
        if (!boardTitle) {
            return toast.error("Please fill board Title")
        }

        const request = {
            title: boardTitle,
        }
        // api call here
        var payload = {
            method: 'post',
            url: `${config().url}/board/`,
            headers: config().headers,
            data : request
        };
        axios(payload)
        .then(response => {
            toast.success(response.data)
            getBoards()
            return toast.success("Board created")
        })
        .catch((error) => {
            toast.error(`Sorry! ${error.message}`)
            console.error(error)
        })
        setBoardTitle(null)
        setCreateBoardShow(false)
    }

    const deleteBoard = (board) => {
        var payload = {
            method: 'delete',
            url: `${config().url}/board/${board._id}`,
            headers: config().headers,
            data : ''
        };
        axios(payload)
        .then(() => {
            getBoards()
            return toast.info("Board deleted")
        })
        .catch(error => {
            toast.error(`Sorry! ${error.message}`)
            console.error(error)
        })
        closeOptionsMenu()
    }

    const editBoard = (boardId) => {
        if (!boardTitle) {
            return toast.error("Board must have a title")
        }

        const request = {
            title: boardTitle
        }
        // api call here
        var payload = {
            method: 'put',
            url: `${config().url}/board/${boardId}/`,
            headers: config().headers,
            data : request
        };
        axios(payload)
        .then(response => {
            toast.success(response.data)
            getBoards()
            return toast.success("Board edited")
        })
        .catch((error) => {
            toast.error(`Sorry! ${error.message}`)
            console.error(error)
        })
        setBoardTitle('')
        editModalClose()
    }

    const logout = () => {
        var payload = {
            method: 'get',
            url: `${config().url}/auth/logout`,
            headers: config().headers,
            data : ''
        }
        axios(payload)
        .then(function () {
          Auth.signout()
          localStorage.removeItem("token");
          history.push('/login')
        })
        .catch(function (error) {
          console.log(error);
        //   return toast.error("email or password incorrect")
        });
    }


    const boardOptionsMenu = (board) => {
        return (
        <Menu anchorEl={optionsAnchorEl} open={optionsOpen} onClose={closeOptionsMenu} keepMounted 
        getContentAnchorEl={null}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        transformOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <MenuItem onClick={() => editModalOpen(board)}><EditIcon /> Edit</MenuItem>
            <MenuItem onClick={() => deleteBoard(board)}><Delete /> Delete</MenuItem>
        </Menu>
        )
    }

    const boardEditModal = (board) => {
        return (
            <ReactModal isOpen={editBoardShow}
            onRequestClose={editModalClose}
            className='editModal'
            overlayClassName='editModalOverlay'
            >
                <Form onSubmit={editBoard}>
                    <TextField
                        id="outlined-multiline-static" label="Edit board" rows={1} defaultValue={board.title}
                        onChange={(e) => setBoardTitle(e.target.value)}  placeholder="Enter new board title" variant="outlined"
                        style={{width:'100%'}}
                    />
                    <Button type='submit' size='large' variant='contained' style={{marginTop:'5px', height:'53px'}}>
                        <DoneAllIcon onClick={() => editBoard(board._id)}/>
                    </Button>
                </Form>
            </ReactModal>
        )
    }

    const boardDrawer = (boards) =>  {
        return  (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
            {boards.map((board, index) => (
                <div>
                    {/* <Link to={`/home/${board._id}`} onClick={() => history.push(`/home/${board._id}`)}> */}
                    <ListItem button key={board.title} onClick={() => history.push(`/home/${board._id}`)}>
                    <ListItemIcon><AssignmentSharpIcon /></ListItemIcon>
                    <ListItemText primary={board.title} />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="more" onClick={(e) => toggleOptionsMenu(e, board)}>
                            <MoreVertIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    </ListItem>
                    {/* </Link> */}

                    {optionsOpen && boardOptionsMenu(currentBoard)}
                    {editBoardShow && boardEditModal(currentBoard)}
                    {/* <Menu anchorEl={optionsAnchorEl} open={optionsOpen} onClose={closeOptionsMenu} keepMounted>
                        <MenuItem><EditIcon /> Edit</MenuItem>
                        <MenuItem onClick={() => deleteBoard(board)}><Delete /> Delete</MenuItem>
                    </Menu> */}
                </div>
            ))}
            </List>
            <Divider />
            {/* Create new board */}
            <List>
                <ListItem button onClick={createModalOpen}>
                    <ListItemIcon>
                        <AddIcon />
                    </ListItemIcon>
                    
                    <ListItemText primary="Create new Board"/>
                </ListItem>
            </List>
        </div>
        )
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            

            <ToastContainer />
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit" aria-label="open drawer"
                        edge="start" onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Avatar src="/checklist.svg" style={{marginRight: '10px'}}/>
                    <h2 className="appBarTitle">Taskify</h2>
   
                    <IconButton onClick={toggleProfileMenu} style={{position: 'absolute', right: '5%'}}>
                        <AccountCircleIcon fontSize='large'/>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
                <Drawer
                    container={container} variant="temporary"
                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                    open={mobileOpen} onClose={handleDrawerToggle} 
                    classes={{ paper: classes.drawerPaper, }}
                    ModalProps={{ keepMounted: true, /* Better open performance on mobile. */}}
                >
                    {boardDrawer(boards)}
                </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    classes={{ paper: classes.drawerPaper }}
                    variant="permanent" open
                >
                    {boardDrawer(boards)}
                </Drawer>
            </Hidden>
                
            {/* {createBoardShow && newBoardModal} */}

            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                
                <Container style={{padding: "5% 5%", left: '240px' }}>
                    <Middle />
                </Container>
            </main>

            <ReactModal isOpen={createBoardShow}
                onRequestClose={createModalClose}
                className='editModal'
                overlayClassName='editModalOverlay'
                >
                    <Form onSubmit={createBoard}>
                        <TextField
                            id="outlined-multiline-static" label="New board" rows={1} defaultValue=' '
                            onChange={(e) => setBoardTitle(e.target.value)}  placeholder="Enter Board title" variant="outlined"
                            style={{width:'100%'}}
                        />
                        <Button type='submit' size='large' variant='contained' style={{marginTop:'5px', height:'53px'}}>
                            <DoneAllIcon onClick={createBoard}/>
                        </Button>
                    </Form>
            </ReactModal>


            {/* Profile menu */}
            <Menu anchorEl={profileMenuAnchorEl} open={profileMenuOpen} onClose={closeProfileMenu} keepMounted
            anchorOrigin={{vertical: "bottom", horizontal: "center"}}
            transformOrigin={{ vertical: "top", horizontal: "center" }} style={{marginTop:'5vh',zIndex:'5000'}}>
                <MenuItem><EditIcon /> Edit profile</MenuItem>
                <MenuItem><Delete /> Change password</MenuItem>
                <MenuItem onClick={logout}><Delete /> Sign out</MenuItem>
            </Menu>
        </div>
    )
}

export default Home;