//make sure the file is called _app.js. This is a file that next js will automatically load with evry page call
import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';

//wrapper around the components we want to show on a screen
const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <div className='container'>
                <Component currentUser={currentUser} {...pageProps} />
            </div>
        </div>
    );


};

//The context for a custom app is different than a page context
//Page context === { req, res }  Custom App === {ctx { req, res }}
AppComponent.getInitialProps = async (appcontext) => { // req propertie is a propertie available
    const client = buildClient(appcontext.ctx);
    //destructuring data
    const { data } = await client.get('/api/users/currentuser'); //axios URL will be formed based on browser or server rendring
    
    
    //IF _app.js (custom app) DOES HAVE getInitialProps DEFINED, THE ONE BELOW DOESN'T GET EXECUTED - WEIRD BEHAVIOR OF NEXT.JS
    // One way to solve this is to invoke getInitialProps for both the custom app and the component from the custom app
    //appcontext DOES HAVE reference to the page compoenet.
    //The function below executes getInitialProps defined in the page. IT MIGHT BE NULL though if the page doesn't have any getInitialProps defined
    let pageProps = {};
    if(appcontext.Component.getInitialProps) {
        pageProps = await appcontext.Component.getInitialProps(appcontext.ctx, client, data.currentUser); //appcontext.ctx has a reference to the page we are loading
    
    }

    return {
        pageProps,
        ...data //has the currentUSer object in it
    }
}


export default AppComponent;