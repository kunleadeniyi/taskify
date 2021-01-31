import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Button, Col, Container, Image, Row } from 'react-bootstrap';

import './Landing.css';
import { Avatar } from '@material-ui/core';

import Auth from '../../config/authenticate';

function Landing() {
    return (
        <div>

            {
            Auth.getAuth() ? <Redirect to="/home" /> 
            :
            <div>
            <Container fluid>
                <Row>
                    <Col md={8} xs={6} style={{display:'inline-flex'}}>
                        <Avatar src="/checklist.svg" className='logo'/>
                        <h2 className="landingTitle">Taskify</h2>    
                    </Col>
                    <Col md={4} xs={6} className="headerBar">
                        <Link to={'/login'} className="headerButtonLink">
                            <Button className="float-sm-right headerBarButton"> Login </Button>
                        </Link>
                        
                        <Link to={'/signup'} className="headerButtonLink">
                            <Button className="float-sm-right headerBarButton"> Sign up </Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
            <section className="sectionSpacing organizeSection">
                <Container fluid>
                    <Row>
                        <Col md={8} xs={12}>
                            <Image src='/images/task_list.svg' alt="tasklist" className="organizeContentImage"/>
                        </Col>
                        <Col md={4} xs={12}>
                            <div className="organizeContent">
                                <h2>Organize your tasks</h2>
                                <Link to={'/signup'} >
                                    <Button size='lg' className="organizeContentButton"> Get Started </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="sectionSpacing">
                <Container fluid>
                    <Row>
                        <Col md={6} xs={12}>
                            <div className="addTaskContent">
                                <h2>Add new tasks and projects with a single click</h2>
                                {/* <Link to={'/login'} >
                                    <Button size='lg' className="organizeContentButton"> Login</Button>
                                </Link> */}
                            </div>
                        </Col>
                        <Col md={6} xs={12}>
                            <Image src='/images/add_task.svg' alt="tasklist" className="addTaskContentImage"/>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="sectionSpacing groupSection">
                <Container fluid>
                    <Row>
                        
                        <Col md={3}>
                        <Image src='/images/categorise_tasks.svg' alt="tasklist" className="groupTaskContentImage "/>
                        </Col>
                        <Col md={3}>
                        <Image src='/images/categorise_tasks2.svg' alt="tasklist" className="groupTaskContentImage img1"/>
                        </Col> 
                       
                        <Col md={6} xs={12}>
                            <div className="groupTaskContent">
                                <h2>Group your goals</h2>
                                <p>Separate Similar tasks into differents boards and ensure you have them neatly categorised</p>
                                {/* <Link to={'/login'} >
                                    <Button size='lg' className="organizeContentButton"> Login</Button>
                                </Link> */}
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>
            <footer className="footer">
                <p>For any suggestion on improving this site,
                <a href="mailto:adeniyikunle22@gmail.com" className='mailMe'> mail me</a></p>
            </footer>
        </div>                        
        }
        </div>
    )
}

export default Landing