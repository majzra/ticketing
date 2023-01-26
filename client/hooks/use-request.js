import { useState } from 'react'; //hooks to track the content of the form
import axios from 'axios'; //to submit request to the sign up microservice

//helper function to be reused by different form to excute an axios request
//we need to specify the URL, the method nd the data of the body
const useRequest = ({url, method, body, onSuccess }) =>  {
    const [errors, setErrors] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrors(null); //the error doesn't clear itself if the user submits a vild request
            //axios[method] could be post, patch, get
            const response = await axios[method](url, {
                ...body, ...props
            });

            //if onSuccess is defined
            if(onSuccess) {
                onSuccess(response.data); //no need to return the response data
            }
            return response.data;

        } catch (err) {
            setErrors( 
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => <li key={err.message}>{err.message}</li>)}
                    </ul>
                </div> 
            ); //set the errors
        }
    };

    return { doRequest, errors };
}

export default useRequest;