import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const SignOut = ({ currentUser }) => {
    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    })

    //call this function once. that's why we include the [] at the end
    useEffect(() => {
        doRequest();
    }, []);

    return <div>Siging you out</div>
};

export default SignOut