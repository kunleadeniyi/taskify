import { Divider, InputAdornment, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Radio  } from '@material-ui/core';
import React, { useState, useEffect } from 'react';

import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import {  DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import AddIcon from '@material-ui/icons/Add';
import AddAlarmIcon from '@material-ui/icons/AddAlarm';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import EditIcon from '@material-ui/icons/Edit';
import { Delete } from '@material-ui/icons';

import './Middle.css';
import { ToastContainer, toast } from 'react-toastify';
import { Col, Form, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import config from '../../config/config';


import ReactModal from 'react-modal';

const axios = require('axios');

function Middle() {
    const { id } = useParams();

    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(true);
    const [showTextField, setShowTextField] = useState(true);

    const [newTask, setNewTask] = useState('');

    const [currentTask, setCurrentTask] = useState({});

    const [display, setDisplay] = useState([]); // tasks to display

    const [show, setShow] = useState(false); // for edit modal
    const handleClose = () => setShow(false); // for modal close
    const handleShow = (tsk) => { // for modal open
        setCurrentTask({...currentTask, ...tsk})
        setShow(true)
        editModal(tsk)
    }; 

    const getTask = () => {
        var payload = {
            method: 'get',
            url: `${config().url}/board/${id}/task`,
            headers: config().headers,
            data : ''
        };
        axios(payload)
        .then(response => {
            setDisplay(response.data.tasks)
        })
        .catch(error => console.error(error))
    }

    useEffect(() => {
        // make api call 
        getTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // id dependency changes the main view display the correct sets of task. 

    const addtask = (e) => {
        e.preventDefault()

        if (!newTask) {
            return toast.error("Can not have empty task")
        }

        const request = {
            body: newTask,
            dueTime: selectedDate ? selectedDate : null
        }
        // api call here
        var payload = {
            method: 'post',
            url: `${config().url}/board/${id}/task`,
            headers: config().headers,
            data : request
        };
        axios(payload)
        .then(response => {
            toast.success(response.data)
            getTask()
            return toast.success("Task added")
        })
        .catch((error) => {
            toast.error(`Sorry! ${error.message}`)
            console.error(error)
        })
        setSelectedDate(null)
        setNewTask('')
    }

    const editTask = (taskId) => {
        if (!newTask) {
            return toast.error("Can not have empty task")
        }

        const request = {
            body: newTask,
            dueTime: selectedDate ? selectedDate : null
        }
        // api call here
        var payload = {
            method: 'put',
            url: `${config().url}/board/${id}/task/${taskId}`,
            headers: config().headers,
            data : request
        };
        axios(payload)
        .then(response => {
            toast.success(response.data)
            getTask()
            return toast.success("Task edited")
        })
        .catch((error) => {
            toast.error(`Sorry! ${error.message}`)
            console.error(error)
        })
        setSelectedDate(null)
        setNewTask(null)
        setShow(false)
    }

    const markAsCompleted = (tsk) => {
        // make api call here
        var payload = {
            method: 'patch',
            url: `${config().url}/board/${id}/task/${tsk._id}/toggleComplete`,
            headers: config().headers,
            data : ''
        };
        axios(payload)
        .then(() => {
            const completedTaskIndex = display.indexOf(tsk, 0)
            display.splice(completedTaskIndex, 1)
            getTask()
        })
        .catch(error => console.error(error))
    }

    const deleteTask = (tsk) => {
        var payload = {
            method: 'delete',
            url: `${config().url}/board/${id}/task/${tsk._id}`,
            headers: config().headers,
            data : ''
        };
        axios(payload)
        .then(() => {
            getTask()
            return toast.info("Task deleted")
        })
        .catch(error => console.error(error))
    }

    const editModal = (tsk) => {
        return (
            <div>
                <Row>
                    <Col md={{ span: 6, offset: 3 }} xs={{ span: 12, offset: 0 }}>
                    <ReactModal
                    isOpen={show}
                    onRequestClose={handleClose}
                    className='editModal'
                    overlayClassName='editModalOverlay'
                    >
                        <TextField
                        id="outlined-multiline-static" label="Edit task" multiline  rows={1} defaultValue={tsk.body}
                        onChange={(e) => setNewTask(e.target.value)}  placeholder="Enter task" variant="outlined"
                        style={{width:'100%'}}
                        /> 
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DateTimePicker style={{marginTop:'5px'}} inputVariant='outlined' value={selectedDate} placeholder='choose date' onChange={setSelectedDate} disablePast/>
                        </MuiPickersUtilsProvider>
                        <Button type='submit' variant='contained' style={{marginTop:'5px', marginLeft:'5px', height:'53px'}}>
                            <DoneAllIcon onClick={() => editTask(tsk._id)} />
                        </Button>
                    </ReactModal>
                    </Col>
                </Row>
            </div>
        )
    }

    const displayTasks = (tasks) => {
    
        return (
            <List className="">
            {tasks.map((task, index) => {
                const labelId = `checkbox-list-label-${task.body}`;
    
                return (/* !task.completed && */  // only show task if it is not complete
                <ListItem key={task.body} dense divider={true}>
                    <ListItemIcon>
                        <Radio
                            checked={task.completed}
                            value={false}
                            onClick={() => markAsCompleted(task)}
                            name="radio-button-demo"
                            id="radio-button-demo"
                        />
                    </ListItemIcon>
    
                    <ListItemText id={labelId} primary={task.body} secondary={task.dueTime ? new Date(task.dueTime).toDateString() : null} />
    
                    <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="edit">
                        <EditIcon onClick={() => {
                            handleShow(task)
                            }}/>
                    </IconButton>
                    <IconButton edge="end" aria-label="delete">
                        <Delete onClick={() => deleteTask(task)}/>
                    </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                );
            })}
            </List>
        )
    }

  return (
    <div className="" style={{position:'relative'}} >
        {show && editModal(currentTask)}
        {/* for taost notification */}
        <ToastContainer style={{zIndex:'10000'}}/>
        <div>
            {displayTasks(display)}
        </div>

        <Divider style={{margin: '20px'}} />

        {id &&
        <Form onSubmit={addtask}>
            <Row className="addTask">
                <AddIcon onClick={() => setShowTextField(!showTextField)} style={{float:'left'}}/>
            
                {/* show text field */}
                {showTextField && 
            
                <Col md={{ span: 8, offset: 0 }} xs={{ span: 12, offset: 0 }} >
                    <TextField
                    id="outlined-multiline-static"
                    label="New task"
                    rows={1}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task"
                    variant="outlined"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <AddAlarmIcon onClick={() => setShowDatePicker(!showDatePicker)}/>
                        </InputAdornment>,
                    }}
                    style={{width:'100%', marginTop:'5px'}}
                    />                
                </Col>
                }

                {/* show date picker */}
                <Col md={{ span: 2, offset: 0 }} xs={{ span: 8, offset: 0 }}>
                {showDatePicker && showTextField &&
                <MuiPickersUtilsProvider utils={DateFnsUtils} style={{marginTop:'5px'}}>
                    <DateTimePicker style={{marginTop:'5px', width:'100% !important'}} inputVariant='outlined' value={selectedDate} placeholder='choose date' onChange={setSelectedDate} disablePast/>
                </MuiPickersUtilsProvider>
                }
                </Col>
                { showTextField && 
                <Col xs={{ span: 2, offset: 0}} md={1} style={{position:'relative', right:'0px'}}>
                    <Button type='submit' size='large' variant='contained' style={{marginTop:'5px', height:'53px'}}>
                        <DoneAllIcon onClick={addtask}/>
                    </Button>
                </Col>
                }
            </Row>
        </Form>
        }
    </div>
  );
}

export default Middle;