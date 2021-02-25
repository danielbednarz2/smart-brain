import React, { useState } from 'react';

const Register = ({loadUser, onRouteChange}) => {
    const [ registerPassword, setRegisterPassword ] = useState('');
    const [ registerEmail, setRegisterEmail ] = useState('');
    const [ registerName, setRegisterName ] = useState('');

    const onNameChange = (e) => {
        setRegisterName(e.target.value)
    }

    const onEmailChange = (e) => {
        setRegisterEmail(e.target.value);
    }
    
    const onPasswordChange = (e) => {
        setRegisterPassword(e.target.value)
    }

    const onSubmitRegister = (e) => {
        e.preventDefault();
        fetch('https://stark-everglades-93601.herokuapp.com/register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: registerName,
                email: registerEmail,
                password: registerPassword
            })
        })
            .then(response => response.json())
            .then(user => {
                if (user.id) {
                    loadUser(user)
                    onRouteChange('home')
                }
            })
    }

    
    return (
        <article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shawdow-5 center">
           <main className="pa4 black-80">
                <form className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">Register</legend>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-90" type="name" name="name"  id="name" onChange={onNameChange} />
                        </div>
                        <div className="mt3">
                            <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email-address"  id="email-address" onChange={onEmailChange} />
                        </div>
                        <div className="mv3">
                            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onChange={onPasswordChange}/>
                        </div>
                    </fieldset>
                    <div className="">
                        <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" onClick={onSubmitRegister} />
                    </div>
                    <div className="lh-copy mt3">
                    </div>
                </form>
            </main>
        </article>
    )
}

export default Register;