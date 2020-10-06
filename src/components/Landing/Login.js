import React, { useState } from 'react';
import GoogleLogin from 'react-google-login'
import { useHistory, Link } from 'react-router-dom'

import './Landing.css';
import config from '../../config/config'
import Auth from '../../config/authenticate'

import 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import { Row, Button, Col, Form } from 'react-bootstrap';
import { Paper, Divider } from '@material-ui/core';

const axios = require('axios')

const googleId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let history = useHistory();

    const login = (e) => {
        e.preventDefault()
        if (!email) {
            return toast.error("Please fill all details")
        }
        if (!password) {
            return toast.error("Please fill all details")
        }
        const request = {
            email: email,
            password: password
        }
    
        axios.post(`${config().url}/auth/login`, request, config().headers)
        .then(function (response) {
          Auth.authenticate()
          localStorage.setItem("token", response.data.token);
          history.push('/home')
        })
        .catch(function (error) {
          console.log(error);
          return toast.error("email or password incorrect")
        });
      }

    const responseGoogle = (googleData) => {
        const request = {
          googleId: googleData.profileObj.googleId,
          email: googleData.profileObj.email,
          displayName: googleData.profileObj.name,
          firstName: googleData.profileObj.givenName,
          lastName: googleData.profileObj.familyName,
          image: googleData.profileObj.imageUrl
        }
        const payload = {
            method: 'post',
            url: `${config().url}/auth/googleSignIn`,
            headers: config().headers,
            data: request
        }
        axios(payload)
        .then(function (response) {
            Auth.authenticate()
            localStorage.setItem("token", response.data.token);
            history.push('/home')
        })
        .catch(function (error) {
            console.log(error);
            return toast.error("email or password incorrect")
        });
    }

    return (
        <div className="login">
            <Row>
                <ToastContainer />
                <Col md={{ span: 4, offset: 4 }} xs={{ span: 12, offset: 0 }}>
                    <Paper elevation={4} style={{padding: '5% 5%'}}>
                    <h2 className='formLabel'>Log in</h2>
                    <GoogleLogin 
                    clientId={googleId} // move variable to .env
                    buttonText="Continue with Google"
                    scope="profile"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    className='googleButton'
                    />
                    <Divider style={{margin: '35px 10px 15px 10px'}}/>
                    <Form onSubmit={login}>
                        <Form.Group controlId="formBasicEmail" className='formItem'>
                            <Form.Label className='formLabel'>Email address</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                            <Form.Text className="text-muted" style={{float:'left'}}>
                            We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className='formItem'>
                            <Form.Label className='formLabel'>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        </Form.Group>
                        
                        <Button variant="primary" type="submit" className="googleButton">
                            Log in
                        </Button>
                    </Form>
                    <Divider style={{margin: '35px 10px 15px 10px'}}/>
                    <p>Don't have an account? <Link to={"/signup"}>Sign up</Link></p>
                    </Paper>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
