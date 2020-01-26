import { HubConnectionBuilder } from '@microsoft/signalr';

let connection;
let events;
export async function connect(endpoint, accessToken, eventsToHandle) {
    const options = accessToken
        ? { accessTokenFactory: () => accessToken }
        : null;
    connection = new HubConnectionBuilder()
        .withUrl(`${self.location.origin}${endpoint}`, options)
        //.withAutomaticReconnect({ nextRetryDelayInMilliseconds: context => 5000 }) //does not work 
        .build();

    events = (eventsToHandle || []);
    events.forEach(eventName =>
        connection.on(eventName, data => onHubEvent(eventName, data))
    );

    // Remark: error cannot be serialized
    connection.onclose(/* err */_ => postMessage({ type: 'connection', eventName: 'close' }));
    //connection.onreconnecting(/* err */_ => postMessage({ type: 'connection', eventName: 'reconnecting' }));
    //connection.onreconnected(_ => postMessage({ type: 'connection', eventName: 'reconnected' }));

    await connection.start();
}

export async function invoke(method, args) {
    return await connection.invoke(method, ...args);
}

export function stream(method, flatten, args) {
    return new Promise((resolve, reject) => {
        const result = [];
        connection.stream(method, ...args)
            .subscribe({
                next: item => {
                    if (flatten)
                        result.push(...item);
                    else
                        result.push(item);
                },
                complete: () => resolve(result),
                error: err => reject(err),
            });
    });
}

export async function stop() {
    await connection.stop();
    events.forEach(eventName => connection.off(eventName));
}

function onHubEvent(eventName, data) {
    postMessage({ type: 'hubevent', eventName, data });
}