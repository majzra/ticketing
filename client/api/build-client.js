import axios from 'axios'; //to submit request to the sign up microservice

const buildClient = ({ req }) => {
     //window object only exists in a browser setup
    if(typeof window === 'undefined') {
        //we are on the server
        //we are on the server!
        //Request will need to be redirected to nginx. 
        // nginx is NOT is the default namespace.
        //we are doing destructuring of the response
        return axios.create({ //preconfigured version of axios
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        //we must be on browser
        //we are on the browser and there is no need to append the 
        //domain in the axios request
        return axios.create({
            baseURL: '/'
        });
    }

};

export default buildClient;