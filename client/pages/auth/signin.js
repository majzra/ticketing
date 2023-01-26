import { useState } from 'react'; //hooks to track the content of the form
import useRequest from '../../hooks/use-request';
import Router from 'next/router'; // to progamtically move the user around. USED in onSUCCESS!!

const signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({ url: '/api/users/signin', method: 'post', body: {email, password}, onSuccess: () => Router.push('/')});

    const onSubmit = async (event) => {
        event.preventDefault(); //to make sure the form doesn't submit itself to the browser   
        await doRequest(); // helper function
    };

    return <form onSubmit={onSubmit}>
        <h1>
            Sign In Page
        </h1>
        <div className="form-group">
            <label>Email Address</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="form-control"></input>
        </div>
        <div className="form-group">
            <label>Password</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control"></input>
        </div>
        {errors}
        <button className="btn btn-primary">Sign In</button>
    </form>
};

export default signup;