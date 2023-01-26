//Fake implementation for testing purpose. Used with JEST
export const natsWrapper = {
    //only fake the objects that need to be used in testing
    //client is an objec
    client : {
        //mock function
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void /*callback function does not return any value */) => {
            callback(); //callback function upon succesful delivery of a message
        })
    },
};