import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => { //from getInitalProps

    const TicketList = tickets.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as ={`/tickets/${ticket.id}`}>
                        View
                    </Link>
                </td>
            </tr>
        );
    });
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Title
                        </th>
                        <th>
                            Price
                        </th>
                        <th>
                            Link
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {TicketList}
                </tbody>
            </table>
        </div>
    );
};

//We are not allowed to fetched data from inside a compoenet duriong server side rendering
//used specificqlly when we are doing our INITIAL app rendering
//executed ONLY ONCE. Initil rendering can only be done during
//server sode rendering in getInitProps and not inside the component
//getInitialProps is called when a page is refreshed, URL is typed or when navigating between pages on the app
//IF _app.js (custom app) DOES HAVE getInitialProps DEFINED, THE ONE BELOW DOESN'T GET EXECUTED - WEIRD BEHAVIOR OF NEXT.JS
//
LandingPage.getInitialProps = async (context,client, currentUser) => { // req propertie is a propertie available
    //const { data } = await buildClient(context).get('/api/users/currentuser'); //axios URL will be formed based on browser or server rendring
    const { data } = await client.get('/api/tickets');

    return { tickets: data };
}

export default LandingPage;