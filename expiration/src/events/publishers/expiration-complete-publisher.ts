import { Subjects, Publisher, ExpirationCompleteEvent } from '@rabztix/common';


export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;    
}